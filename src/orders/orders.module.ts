import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities';
import { OrderLinesModule } from 'src/order-lines';
import { ProductsModule } from 'src/products';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), OrderLinesModule, ProductsModule],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule {}
