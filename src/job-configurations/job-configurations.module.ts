import { Module } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConfiguration } from './entities/job-configuration.entity';
import { JobsModule } from 'src/jobs';
import { SuppliersModule } from 'src/suppliers';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
@Module({
  imports: [TypeOrmModule.forFeature([JobConfiguration])],
  providers: [JobConfigurationsService],
  exports: [JobConfigurationsService]
})
export class JobConfigurationsModule { }
