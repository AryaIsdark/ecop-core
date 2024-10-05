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

  async upsert(createOrderLineDto: CreateOrderLineDto) {
    // Check if an order line with the same product_sku and orderId already exists
    let existingOrderLine = await this.repository.findOne({
      where: {
        product_sku: createOrderLineDto.product_sku,
        orderId: createOrderLineDto.orderId
      }
    });

    if (existingOrderLine) {
      await this.update(existingOrderLine.id, createOrderLineDto)

      return 'successfully updated order line';
    } else {
      await this.create(createOrderLineDto)

      return 'successfully created order line';
    }
  }

  async create(createOrderLineDto: CreateOrderLineDto) {
    const orderLine = new OrderLine();
    orderLine.clientId = createOrderLineDto.clientId
    orderLine.orderId = createOrderLineDto.orderId
    orderLine.product_sku = createOrderLineDto.product_sku
    orderLine.product_ean = createOrderLineDto.product_ean
    orderLine.quantity = createOrderLineDto.quantity
    orderLine.originalCreatedAt = createOrderLineDto.originalCreatedAt
    await this.repository.save(orderLine)

    await this.productAnalyticsService.create({
      clientId: orderLine.clientId,
      orderId: orderLine.orderId,
      product_ean: orderLine.product_ean,
      product_sku: orderLine.product_sku,
      count: orderLine.quantity
    })

    return 'succesfully created order line'
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} orderLine`;
  }


  async getClientOrderLines(clientId: number, take: number) {
    return await this.repository.find({ where: { clientId }, take, order: { createdAt: 'DESC' } })
  }

  async getOrderLineItems(orderId: number) {
    return await this.repository.find({ where: { orderId } })
  }

  async update(id: number, updateOrderLineDto: UpdateOrderLineDto) {
    // Find the existing order line by ID
    const existingOrderLine = await this.repository.findOne({ where: { id } });

    if (!existingOrderLine) {
      throw new Error('Order line not found');
    }

    // Update the properties of the existing order line
    existingOrderLine.clientId = updateOrderLineDto.clientId ?? existingOrderLine.clientId;
    existingOrderLine.product_sku = updateOrderLineDto.product_sku ?? existingOrderLine.product_sku;
    existingOrderLine.product_ean = updateOrderLineDto.product_ean ?? existingOrderLine.product_ean;
    existingOrderLine.quantity = updateOrderLineDto.quantity ?? existingOrderLine.quantity;

    // Save the updated order line
    await this.repository.save(existingOrderLine);

    return 'successfully updated order line';
  }


  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
