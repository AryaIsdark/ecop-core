import { Module } from '@nestjs/common';
import { InventorySyncService } from './inventory-sync.service';
import { InventoryModule } from 'src/inventory/inventory.module';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';
import { WicsWmsConnectorModule } from 'src/wics-wms-connector/wics-wms-connector.module';
import { PurchaseOrdersModule } from 'src/purchase-orders';
import { PurchaseOrderLineItemsModule } from 'src/purchase-order-line-items';
import { OrdersModule } from 'src/orders';
import { OrderLinesModule } from 'src/order-lines';

@Module({
  imports: [
    InventoryModule,
    WarehouseManagementSystemsModule,
    OngoingWmsConnectorModule,
    WicsWmsConnectorModule,
    ],
  providers: [InventorySyncService],
  exports: [InventorySyncService]
})
export class InventorySyncModule { }
