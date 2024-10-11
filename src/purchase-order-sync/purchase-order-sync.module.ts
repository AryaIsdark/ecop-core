import { Module } from '@nestjs/common';
import { PurchaseOrdersModule } from 'src/purchase-orders';
import { PurchaseOrderSyncService } from './purchase-order-sync.service';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';
import { PurchaseOrderLineItemsModule } from 'src/purchase-order-line-items';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { SuppliersModule } from 'src/suppliers';
import { ProductsModule } from 'src/products';

@Module({
  imports: [
    SuppliersModule,
    PurchaseOrdersModule, 
    ProductsModule,
    PurchaseOrderLineItemsModule, 
    WarehouseManagementSystemsModule,
    OngoingWmsConnectorModule],
  providers: [PurchaseOrderSyncService],
  exports: [PurchaseOrderSyncService]
})
export class PurchaseOrderSyncModule { }
