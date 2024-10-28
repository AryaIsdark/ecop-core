import { Module } from '@nestjs/common';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';
import { WicsWmsConnectorModule } from 'src/wics-wms-connector/wics-wms-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseManagementSystem]), WicsWmsConnectorModule],
  providers: [WarehouseManagementSystemsService],
  exports: [WarehouseManagementSystemsService]
})
export class WarehouseManagementSystemsModule {}
