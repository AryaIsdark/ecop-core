import { Module } from '@nestjs/common';
import { InventorySyncService } from './inventory-sync.service';
import { InventorySyncController } from './inventory-sync.controller';
import { InventoryModule } from 'src/inventory/inventory.module';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';

@Module({
  imports: [InventoryModule, WarehouseManagementSystemsModule, OngoingWmsConnectorModule],
  controllers: [InventorySyncController],
  providers: [InventorySyncService],
  exports: [InventorySyncService]
})
export class InventorySyncModule {}
