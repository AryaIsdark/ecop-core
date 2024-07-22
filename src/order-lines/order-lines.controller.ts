import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderLinesService } from './order-lines.service';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';

@Controller('order-lines')
export class OrderLinesController {
  constructor(private readonly orderLinesService: OrderLinesService) {}

  @Post()
  create(@Body() createOrderLineDto: CreateOrderLineDto) {
    return this.orderLinesService.create(createOrderLineDto);
  }

  @Get()
  findAll() {
    return this.orderLinesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderLinesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderLineDto: UpdateOrderLineDto) {
    return this.orderLinesService.update(+id, updateOrderLineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderLinesService.remove(+id);
  }
}
