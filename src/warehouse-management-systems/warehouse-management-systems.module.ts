import { Module } from '@nestjs/common';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';
import { WicsWmsConnectorModule } from 'src/wics-wms-connector/wics-wms-connector.module';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseManagementSystem]), WicsWmsConnectorModule, OngoingWmsConnectorModule],
  providers: [WarehouseManagementSystemsService],
  exports: [WarehouseManagementSystemsService]
})
export class WarehouseManagementSystemsModule {}
