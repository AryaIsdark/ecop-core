import { Module } from '@nestjs/common';
import { OrderSyncService } from './order-sync.service';
import { OrdersModule } from 'src/orders';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { OrderLinesModule } from 'src/order-lines';

@Module({
  imports: [OrdersModule, OrderLinesModule, EcommercePlatformsModule, ShopifyConnectorModule],
  providers: [OrderSyncService],
  exports: [OrderSyncService]
})
export class OrderSyncModule { }
