import { Injectable } from '@nestjs/common';
import { downloadProductFeed } from './web-automations/download-product-feed';

export enum PowerbodyWebautomationAction {
  DOWNLOAD_PRODUCT_FEED = 'download-product-feed'
}

export type PowerbodyWebAutomationConfig = {
  action: PowerbodyWebautomationAction,
  username: string, 
  password: string,
}

@Injectable()
export class PowerbodyConnectorService {

  async handleDownloadProductFeedAction(config: PowerbodyWebAutomationConfig, tenantId){
    return await downloadProductFeed(config, tenantId)
  }

  async handleWebAutomationJob(config : PowerbodyWebAutomationConfig, tenantId){
    if(config.action === PowerbodyWebautomationAction.DOWNLOAD_PRODUCT_FEED){
      await this.handleDownloadProductFeedAction(config, tenantId)
      return 'download was completed'
    }
  }
}
