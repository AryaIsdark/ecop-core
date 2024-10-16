import { Injectable } from '@nestjs/common';
import { downloadProductFeed } from './web-automations/download-product-feed';
import { processExcelProductFeed } from './processors/process-excel-product-feed';
import * as fs from 'fs';
import * as path from 'path';
import { Product } from 'src/products';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';


export type PowerBodyProduct = {
  brand?: string,
  name?: string, 
  sku?: string, 
  ean?: string, 
  stock?: string, 
  price1?: string,
  price2?: string,
  price3?: string,
}

export enum PowerbodyWebautomationAction {
  DOWNLOAD_PRODUCT_FEED = 'download-product-feed'
}

export type PowerbodyWebAutomationConfig = {
  action: PowerbodyWebautomationAction,
  username: string,
  password: string,
  productMappingKeys: Record<string, string>
}

@Injectable()
export class PowerbodyConnectorService {

  async handleRenameFile(folderPath: string): Promise<void> {
    console.log('handleRenameFile begins')
    try {
      const files = await fs.readdirSync(folderPath);
      for (const file of files) {
        // Rename each file to 'powerbody.xls'
        const oldPath = path.join(folderPath, file);
        const newPath = path.join(folderPath, 'powerbody.xls');

        try {
          await fs.renameSync(oldPath, newPath);
          console.log(`Renamed ${file} to powerbody.xls`);
          return; // Exit after renaming the first file
        } catch (err) {
          console.error(`Error renaming file ${file}: ${err}`);
        }
      }
    } catch (err) {
      console.error(`Error reading folder: ${err}`);
    }
  }

  async handleDownloadProductFeedAction(tenantId: number, config: PowerbodyWebAutomationConfig) : Promise<Partial<Product>[]> {
    try {
      const folderPath = './test-folder'
      // const folderPath = `./tenants/${tenantId}/powerbody/product-feeds`;

      // Ensure the directory exists before proceeding
      if (!fs.existsSync(folderPath)) {
        console.log('folder does not exists, so Im making a new one')
        fs.mkdirSync(folderPath, { recursive: true }); // Creates the folder and necessary parent directories
      }

      // Proceed with the download
      await downloadProductFeed(config);

      // Handle renaming the file (you can adjust this logic based on what handleRenameFile does)
      await this.handleRenameFile(folderPath);

      const rootFolder = process.cwd();
      const fileName = 'powerbody.xls';
      const filePath = path.join(rootFolder, folderPath, fileName);
      console.info('fiiiiiiiiiiiiile',filePath)

      // Process the Excel product feed
      const powerbody_products : PowerBodyProduct[] = await processExcelProductFeed(filePath, config.productMappingKeys);
      const products : Partial<Product>[] = []
      for(const powerbodyProduct of powerbody_products){
        products.push({
            brand: powerbodyProduct.brand,
            ean: powerbodyProduct.ean,
            ean_normalized: normalizeEAN(powerbodyProduct.ean), 
            name: powerbodyProduct.name,
            sku: powerbodyProduct.sku,
            price: Number(powerbodyProduct.price1 ?? powerbodyProduct.price2 ?? powerbodyProduct.price3),
            stock: powerbodyProduct.stock
        })
    }

      return products;
    }
    catch (e) {
      console.error('handleDownloadProductFeedAction', e)
    }
  }

  async handleWebAutomationJob(config: PowerbodyWebAutomationConfig, tenantId) {
    if (config.action === PowerbodyWebautomationAction.DOWNLOAD_PRODUCT_FEED) {
      return await this.handleDownloadProductFeedAction(tenantId, config)
    }
  }
}
