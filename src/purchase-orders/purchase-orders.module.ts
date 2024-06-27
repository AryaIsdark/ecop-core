import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersModule } from 'src/suppliers';
import { PurchaseOrderLineItemsModule } from 'src/purchase-order-line-items';


@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder]), SuppliersModule, PurchaseOrderLineItemsModule],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService]
})
export class PurchaseOrdersModule {}
