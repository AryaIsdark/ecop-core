import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersModule } from 'src/suppliers';
import { PurchaseOrderLineItemsModule } from 'src/purchase-order-line-items';
import { InventoryModule } from 'src/inventory/inventory.module';
import { Product } from 'src/products';
import { OrderLinesModule } from 'src/order-lines';


@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder, Product]), SuppliersModule,OrderLinesModule, PurchaseOrderLineItemsModule, InventoryModule],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService]
})
export class PurchaseOrdersModule {}
