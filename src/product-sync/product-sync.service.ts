import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { getProductsFromXML, readAndMapExcel } from 'src/utils';
import { CreateProductMediaDto } from 'src/product-media/dto/create-product-media.dto';
import { ProductMediaService, ProductMediaType } from 'src/product-media';
import { readWebApiFeed } from 'src/utils/read-webapi-feed/read-webapi-feed';

@Injectable()
export class ProductSyncService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productMediaService: ProductMediaService) {

  }

  async handleSyncProductImagesJob(jobConfiguration: JobConfiguration) {
    console.log('I ran handleSyncProductImagesJob')
    const products = await this.productsService.getClientProducts(jobConfiguration.tenantId)
    let uploadMediaItems = []
    for (const product of products.filter((p)=> p.main_image_url?.length && p.ean_normalized)) {
      const createProductMediaDto: CreateProductMediaDto = {
        clientId: jobConfiguration.tenantId,
        product_ean: product.ean_normalized,
        type: ProductMediaType.IMAGE
      }
      uploadMediaItems.push({ url: product.main_image_url, createProductMediaDto })
    }

    await this.productMediaService.uploadFromUrl(uploadMediaItems)
  }

  async handleSyncProducts(clientId, supplierId, products: Partial<Product>[]) {
    await this.productsService.upserProducts(clientId, supplierId, products)
  }

  async handleSyncXmlFeedJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const { feed_url, productMappingKeys, responsePath, discountInPercentage } = config

      const data = await getProductsFromXML(feed_url, responsePath, productMappingKeys, discountInPercentage)
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[])

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
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[])
    }
    catch (e) {
      throw (e)
    }
  }

  async handleSyncWebApiJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const { feed_url, productMappingKeys, authorization, responsePath } = config
      const data = await readWebApiFeed(feed_url, authorization, responsePath, productMappingKeys )
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[])
    }
    catch (e) {
      throw (e)
    }
  }



  async handleSyncProductJob(jobConfiguration: JobConfiguration) {
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
