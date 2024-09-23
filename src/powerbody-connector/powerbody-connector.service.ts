import { Injectable } from '@nestjs/common';
import { downloadProductFeed } from './web-automations/download-product-feed';
import { processExcelProductFeed } from './processors/process-excel-product-feed';
import * as fs from 'fs';
import * as path from 'path';

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

  async handleDownloadProductFeedAction_old(tenantId: number, config: PowerbodyWebAutomationConfig) {
    const folderPath = `./tenants/${tenantId}/powerbody/product-feeds`
    await downloadProductFeed(config, tenantId, folderPath)
    await this.handleRenameFile(folderPath)
    const rootFolder = process.cwd();
    const fileName = 'powerbody.xls';
    const filePath = path.join(rootFolder, folderPath, fileName);
    const powerbody_products = await processExcelProductFeed(filePath, config.productMappingKeys)
    return powerbody_products
  }

  async handleDownloadProductFeedAction(tenantId: number, config: PowerbodyWebAutomationConfig) {
    try {
      const folderPath = `./tenants/${tenantId}/powerbody/product-feeds`;

      // Ensure the directory exists before proceeding
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true }); // Creates the folder and necessary parent directories
      }

      // Proceed with the download
      await downloadProductFeed(config, tenantId, folderPath);

      // Handle renaming the file (you can adjust this logic based on what handleRenameFile does)
      await this.handleRenameFile(folderPath);

      const rootFolder = process.cwd();
      const fileName = 'powerbody.xls';
      const filePath = path.join(rootFolder, folderPath, fileName);

      // Process the Excel product feed
      const powerbody_products = await processExcelProductFeed(filePath, config.productMappingKeys);

      return powerbody_products;
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
