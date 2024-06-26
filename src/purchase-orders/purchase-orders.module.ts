import { Module } from '@nestjs/common';
import { PurchaseOrdersService } from './purchase-orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrder } from './entities/purchase-order.entity';
import { SuppliersModule } from 'src/suppliers';

@Module({
  imports : [TypeOrmModule.forFeature([PurchaseOrder]), SuppliersModule],
  providers: [PurchaseOrdersService],
  exports: [PurchaseOrdersService]
})
export class PurchaseOrdersModule {}
