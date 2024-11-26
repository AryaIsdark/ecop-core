import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { JobConfigurationsModule } from 'src/job-configurations/job-configurations.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), JobsModule, SubscriptionsModule, EcommercePlatformsModule, SuppliersModule, JobConfigurationsModule, WarehouseManagementSystemsModule],
  providers: [ClientsService],
  exports: [ClientsService]
})
export class ClientsModule { }
