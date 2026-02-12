import { Module } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductMediaModule } from 'src/product-media';
import { KachingSubscriptionsConnectorModule } from 'src/kaching-subscriptions-connector/kaching-subscriptions-connector.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';
import { ClientsModule } from 'src/clients';

@Module({
  imports: [
    ProductsModule,
    ProductMediaModule,
    KachingSubscriptionsConnectorModule,
    EcommercePlatformsModule,
    ShopifyConnectorModule,
    ClientsModule,
  ],
  providers: [ProductSyncService],
  exports: [ProductSyncService],
})
export class ProductSyncModule {}
