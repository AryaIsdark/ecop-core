import { Module } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductMediaModule } from 'src/product-media';
import { KachingSubscriptionsConnectorModule } from 'src/kaching-subscriptions-connector/kaching-subscriptions-connector.module';

@Module({
  imports: [ProductsModule, ProductMediaModule, KachingSubscriptionsConnectorModule],
  providers: [ProductSyncService],
  exports : [ProductSyncService]
})
export class ProductSyncModule {}
