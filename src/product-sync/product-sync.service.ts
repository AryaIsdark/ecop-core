import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { getProductsFromXML, readAndMapExcel } from 'src/utils';

@Injectable()
export class ProductSyncService {
  constructor(private readonly productsService: ProductsService) {

  }

  async handleSyncProducts(clientId, supplierId, products: Product[]) {
    await this.productsService.upserProducts(clientId, supplierId, products)
  }

  async handleSyncXmlFeedJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const {feed_url, productMappingKeys, responsePath} = config
      
      const data = await getProductsFromXML(feed_url, responsePath, productMappingKeys)
      await this.handleSyncProducts(tenantId, entityReferenceId, data as unknown as Product[])

    }
    catch (e) {
      throw (e)
    }
  }
  
  async handleSyncExcelFeedJob(jobConfiguration: JobConfiguration) {
    try {
      const { entityReferenceId, tenantId, config } = jobConfiguration
      const {feed_url, productMappingKeys, junkRows = []} = config
      const data = await readAndMapExcel(feed_url, junkRows, productMappingKeys)
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
      if(jobConfiguration.syncType === 'ExcelFeed') {
        await this.handleSyncExcelFeedJob(jobConfiguration)
      }
    }
    catch (e) {
      throw (e)
    }

    return true
  }
}
