import { Module } from '@nestjs/common';
import { JobProcessorService } from './job-processor.service';
import { Job } from 'src/jobs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductSyncModule } from 'src/product-sync';
import { OrderSyncModule } from 'src/order-sync/order-sync.module';
import { PurchaseOrderSyncModule } from 'src/purchase-order-sync/purchase-order-sync.module';
import { JobConfigurationsModule } from 'src/job-configurations';
import { InventorySyncModule } from 'src/inventory-sync/inventory-sync.module';
import { WebAutomationsModule } from 'src/web-automations/web-automations.module';
import { ProductAnalyticsModule } from 'src/product-analytics';
import { KachingSubscriptionsConnectorModule } from 'src/kaching-subscriptions-connector/kaching-subscriptions-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]),
    ProductSyncModule,
    OrderSyncModule,
    PurchaseOrderSyncModule,
    JobConfigurationsModule,
    InventorySyncModule,
    WebAutomationsModule,
    ProductAnalyticsModule,
    KachingSubscriptionsConnectorModule,
  ],
  providers: [JobProcessorService],
  exports: [JobProcessorService]
})
export class JobProcessorModule {}
