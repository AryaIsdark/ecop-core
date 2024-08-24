import { Module } from '@nestjs/common';
import { ShopifyConnectorService } from './shopify-connector.service';

@Module({
  providers: [ShopifyConnectorService],
  exports: [ShopifyConnectorService]
})
export class ShopifyConnectorModule {}
