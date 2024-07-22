import { Module } from '@nestjs/common';
import { OrderSyncService } from './order-sync.service';
import { OrderSyncController } from './order-sync.controller';
import { OrdersModule } from 'src/orders';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { OrderLinesModule } from 'src/order-lines';

@Module({
  imports: [OrdersModule, OrderLinesModule, EcommercePlatformsModule, ShopifyConnectorModule],
  controllers: [OrderSyncController],
  providers: [OrderSyncService],
  exports: [OrderSyncService]
})
export class OrderSyncModule { }
