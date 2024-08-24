import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobConfigurationsModule } from 'src/job-configurations/job-configurations.module';
import { ProductsModule } from 'src/products/products.module';
import { ProductSyncModule } from 'src/product-sync/product-sync.module';
import { OrderSyncModule } from 'src/order-sync/order-sync.module';
import { InventorySyncModule } from 'src/inventory-sync/inventory-sync.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]),
    ProductSyncModule,
    OrderSyncModule,
    JobConfigurationsModule,
    InventorySyncModule],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule { }
