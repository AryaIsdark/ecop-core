import { Module } from '@nestjs/common';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { ProductsModule } from 'src/products';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderLineItem]), ProductsModule],
  providers: [PurchaseOrderLineItemsService],
  exports: [PurchaseOrderLineItemsService]
})
export class PurchaseOrderLineItemsModule {}
