import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { getProductsFromXML, readAndMapExcel } from 'src/utils';
import { CreateProductMediaDto } from 'src/product-media/dto/create-product-media.dto';
import { ProductMediaService, ProductMediaType } from 'src/product-media';
import { readWebApiFeed } from 'src/utils/read-webapi-feed/read-webapi-feed';
import { isDateValidByShelfLife } from 'src/utils/is-date-valid-by-shelf-life/is-date-valid-by-shelf-life';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';
import { normalizeDate } from 'src/utils/normalize-date/normalize-date';

@Injectable()
export class ProductSyncService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productMediaService: ProductMediaService) {

  }

  normalizeProducts(products: Partial<Product>[]) : Partial<Product>[]{
    return products.map((product)=> ({
      ...product,
      ean_normalized: normalizeEAN(product.ean),
      expiration_date_normalized: product.expiration_date ? (normalizeDate(product.expiration_date) ?? null) : null,
    }) )
  }

  async handleSyncProductImagesJob(jobConfiguration: JobConfiguration) {
    const products = await this.productsService.getClientProducts(jobConfiguration.tenantId)
    let uploadMediaItems = []
    for (const product of products.filter((p) => p.main_image_url?.length && p.ean_normalized)) {
      const createProductMediaDto: CreateProductMediaDto = {
        clientId: jobConfiguration.tenantId,
        product_ean: product.ean_normalized,
        type: ProductMediaType.IMAGE
      }
      uploadMediaItems.push({ url: product.main_image_url, createProductMediaDto })
    }

    await this.productMediaService.uploadFromUrl(uploadMediaItems)
  }

  excludeProductsWithShortExpiryDate(minimumShelfLife: string, products: Partial<Product>[]){
    const filteredProducts = []
    for(const product of products){
      if(!product.expiration_date){
        filteredProducts.push(product)
      }
      else if(isDateValidByShelfLife(product.expiration_date_normalized, minimumShelfLife)){
        filteredProducts.push(product)
      }
    }
    return filteredProducts
  }

  async handleSyncProducts(clientId, supplierId, products: Partial<Product>[], jobConfiguration: JobConfiguration) {
    const {config} = jobConfiguration
    let normalizedProducts = this.normalizeProducts(products)
    if(config.minimumShelfLife){
      normalizedProducts = this.excludeProductsWithShortExpiryDate(config.minimumShelfLife , normalizedProducts)
    }
    await this.productsService.upserProducts(clientId, supplierId, normalizedProducts)
  }

  async handleSyncXmlFeedJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const { feed_url, productMappingKeys, responsePath, discountInPercentage } = config

      const data = await getProductsFromXML(feed_url, responsePath, productMappingKeys, discountInPercentage)
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[], jobConfiguration)

    }
    catch (e) {
      throw (e)
    }
  }

  async handleSyncExcelFeedJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const { feed_url, productMappingKeys, junkRows = [] } = config
      const data = await readAndMapExcel(feed_url, junkRows, productMappingKeys)
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[], jobConfiguration)
    }
    catch (e) {
      throw (e)
    }
  }

  async handleSyncWebApiJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const { feed_url, productMappingKeys, authorization, responsePath } = config
      const data = await readWebApiFeed(feed_url, authorization, responsePath, productMappingKeys)
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[], jobConfiguration)
    }
    catch (e) {
      throw (e)
    }
  }

  async handleSyncProductJob(jobConfiguration: JobConfiguration) {

    await this.productsService.resetProductStockBySupplier(jobConfiguration.tenantId, jobConfiguration.entityReferenceId)

    try {
      if (jobConfiguration.syncType === 'XmlFeed') {
        await this.handleSyncXmlFeedJob(jobConfiguration)
      }
      if (jobConfiguration.syncType === 'ExcelFeed') {
        await this.handleSyncExcelFeedJob(jobConfiguration)
      }
      if (jobConfiguration.syncType === 'WebAPI') {
        await this.handleSyncWebApiJob(jobConfiguration)
      }
    }
    catch (e) {
      throw (e)
    }

    return true
  }
}
