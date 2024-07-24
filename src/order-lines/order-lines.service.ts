import { Injectable } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { OrderLine } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAnalyticsService } from 'src/product-analytics';

@Injectable()
export class OrderLinesService {
  constructor(
    @InjectRepository(OrderLine)
    private readonly repository: Repository<OrderLine>,
    private readonly productAnalyticsService: ProductAnalyticsService
  ) {

  }
  async create(createOrderLineDto: CreateOrderLineDto) {
    const orderLine = new OrderLine();
    orderLine.clientId = createOrderLineDto.clientId
    orderLine.orderId = createOrderLineDto.orderId
    orderLine.product_sku = createOrderLineDto.product_sku
    orderLine.product_ean = createOrderLineDto.product_ean
    orderLine.quantity = 1
    await this.repository.save(orderLine)

    await this.productAnalyticsService.create({
      clientId: orderLine.clientId,
      orderId: orderLine.orderId,
      product_ean: orderLine.product_ean,
      product_sku: orderLine.product_sku,
      count: 1
    })

    return 'succesfully created order line'
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
