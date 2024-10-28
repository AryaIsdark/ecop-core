import { Module, forwardRef } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersModule } from 'src/suppliers';
import { PurchaseOrderLineItemsModule } from 'src/purchase-order-line-items';
import { InventoryModule } from 'src/inventory/inventory.module';
import { Product } from 'src/products';
import { OrderLinesModule } from 'src/order-lines';
import { PurchaseOrderSuggestionsModule } from 'src/purchase-order-suggestions';
import { ClientsModule } from 'src/clients';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';


@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder, Product]), forwardRef(()=> ClientsModule), WarehouseManagementSystemsModule, SuppliersModule,OrderLinesModule, PurchaseOrderLineItemsModule, InventoryModule, PurchaseOrderSuggestionsModule],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService]
})
export class PurchaseOrdersModule {}
