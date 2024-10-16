import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { downloadProductFeed } from './web-automations/download-product-feed';
import { processExcelProductFeed } from './processors/process-excel-product-feed';
import { Product } from 'src/products';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';

const delay = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

  // Function to get the latest file from a folder
  async getLatestFile(folderPath: string): Promise<string | null> {
    try {
      const files = await fs.promises.readdir(folderPath);

      if (files.length === 0) {
        console.error('No files found in folder');
        return null;
      }

      // Get file info and sort by modification time (newest first)
      const sortedFiles = await Promise.all(
        files.map(async file => {
          const filePath = path.join(folderPath, file);
          const stats = await fs.promises.stat(filePath);
          return { filePath, mtime: stats.mtime };
        })
      );

      sortedFiles.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

      // Return the path of the latest file
      return sortedFiles[0].filePath;
    } catch (err) {
      console.error(`Error getting latest file: ${err}`);
      return null;
    }
  }

  async allocateFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) {
      console.log('Folder does not exist, creating a new one');
      await fs.promises.mkdir(folderPath, { recursive: true });

      // Double check if folder creation was successful
      if (!fs.existsSync(folderPath)) {
        console.error('Failed to create folder:', folderPath);
        return null;
      }
    } else {
      console.info('Folder already exists:', folderPath);
    }
  }

  async handleDownloadProductFeedAction(tenantId: number, config: PowerbodyWebAutomationConfig): Promise<string | null> {
    try {
      const downloadPath = path.join(process.cwd(), `./tenants/${tenantId}/powerbody/product-feeds`);

      const isFolderReady = this.allocateFolder(downloadPath)

      if (isFolderReady) {
        console.info('Attempting to download file to this path: ', downloadPath)

        await downloadProductFeed(config, downloadPath);

        const latestFilePath = await this.getLatestFile(downloadPath);

        console.info('Latest File path:', latestFilePath);

        if (fs.existsSync(latestFilePath)) {
          return latestFilePath;
        } else {
          console.error('File not found after renaming.');
          return null;
        }
      }
      else {
        console.error('Folder was not ready please try again.')
      }
    } catch (e) {
      console.error('handleDownloadProductFeedAction error:', e);
      return null;
    }
  }

  mapProducts = (powerbodyProducts: PowerBodyProduct[]): Partial<Product>[] => {
    const products = powerbodyProducts.map((powerbodyProduct) => {
      return {
        brand: powerbodyProduct.brand,
        ean: powerbodyProduct.ean,
        ean_normalized: normalizeEAN(powerbodyProduct.ean),
        name: powerbodyProduct.name,
        sku: powerbodyProduct.sku,
        price: Number(powerbodyProduct.price1 ?? powerbodyProduct.price2 ?? powerbodyProduct.price3),
        stock: powerbodyProduct.stock,
      };
    });

    return products;
  }


  async handleWebAutomationJob(config: PowerbodyWebAutomationConfig, tenantId: number) {
    if (config.action === PowerbodyWebautomationAction.DOWNLOAD_PRODUCT_FEED) {
      const filePath = await this.handleDownloadProductFeedAction(tenantId, config);

      if (filePath) {
        const powerbodyProducts: PowerBodyProduct[] = await processExcelProductFeed(filePath, config.productMappingKeys);
        const products: Partial<Product>[] = this.mapProducts(powerbodyProducts)
        if (!products.length) {
          return []
        }
        return products
      }
    }
  }
}
