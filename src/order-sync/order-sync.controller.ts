import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderSyncService } from './order-sync.service';
import { CreateOrderSyncDto } from './dto/create-order-sync.dto';
import { UpdateOrderSyncDto } from './dto/update-order-sync.dto';

@Controller('order-sync')
export class OrderSyncController {
  constructor(private readonly orderSyncService: OrderSyncService) {}

  @Post()
  create(@Body() createOrderSyncDto: CreateOrderSyncDto) {
    return this.orderSyncService.create(createOrderSyncDto);
  }

  @Get()
  findAll() {
    return this.orderSyncService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderSyncService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderSyncDto: UpdateOrderSyncDto) {
    return this.orderSyncService.update(+id, updateOrderSyncDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderSyncService.remove(+id);
  }
}
