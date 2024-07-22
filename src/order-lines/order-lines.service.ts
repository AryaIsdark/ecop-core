import { Injectable } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { OrderLine } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderLinesService {
  constructor(
    @InjectRepository(OrderLine)
    private readonly repository: Repository<OrderLine>,
  ) {

  }
  async create(createOrderLineDto: CreateOrderLineDto) {
    const newOrderLine = new OrderLine();
    newOrderLine.clientId = createOrderLineDto.clientId
    newOrderLine.orderId = createOrderLineDto.orderId
    newOrderLine.product_sku = createOrderLineDto.product_sku
    newOrderLine.product_ean = createOrderLineDto.product_ean
    newOrderLine.quantity = 1
    return await this.repository.save(newOrderLine)
  }

  findAll() {
    return `This action returns all orderLines`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLine`;
  }

  update(id: number, updateOrderLineDto: UpdateOrderLineDto) {
    return `This action updates a #${id} orderLine`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
