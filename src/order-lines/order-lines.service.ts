import { Injectable } from '@nestjs/common';
import { CreateOrderLineDto } from './dto/create-order-line.dto';
import { UpdateOrderLineDto } from './dto/update-order-line.dto';
import { OrderLine, OrderLineStatus, OrderLinesQueryParams } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { ProductAnalyticsService } from 'src/product-analytics';
import { OrderStatus } from 'src/orders';

@Injectable()
export class OrderLinesService {
  constructor(
    @InjectRepository(OrderLine)
    private readonly repository: Repository<OrderLine>,
    private readonly productAnalyticsService: ProductAnalyticsService
  ) {

  }

  // async getClientUnfulfilledOrderLines(clientId: number){
  //   return await this.repository.find({where : {clientId, orderStatus: Not(OrderStatus.FULLFILED)}})
  // }

  async query(params: OrderLinesQueryParams) {
    let whereConditions: Partial<OrderLinesQueryParams> = {}
    if (params.product_ean) {
      whereConditions = {
        ...whereConditions, product_ean: params.product_ean
      }
    }

    if (params.clientId) {
      whereConditions = {
        ...whereConditions, clientId: params.clientId
      }
    }

    if (params.orderId) {
      whereConditions = {
        ...whereConditions, orderId: params.orderId
      }
    }

    const data = await this.repository.find({ where: whereConditions })

    return data
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
    orderLine.status = createOrderLineDto.status
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


  async getClientUnfullfiledOrderLines(clientId: number) {
    return await this.repository.find({ where: { clientId,  status: Not(OrderLineStatus.FULLFILED)} })
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
    existingOrderLine.status = updateOrderLineDto.status ?? existingOrderLine.status;

    // Save the updated order line
    await this.repository.save(existingOrderLine);

    return 'successfully updated order line';
  }


  remove(id: number) {
    return `This action removes a #${id} orderLine`;
  }
}
