import { Module } from '@nestjs/common';
import { ShopifyConnectorService } from './shopify-connector.service';
import { ShopifyConnectorController } from './shopify-connector.controller';

@Module({
  controllers: [ShopifyConnectorController],
  providers: [ShopifyConnectorService],
  exports: [ShopifyConnectorService]
})
export class ShopifyConnectorModule {}
