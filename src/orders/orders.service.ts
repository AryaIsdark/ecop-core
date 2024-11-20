import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, OrdersQueryParams } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';
import { Paginate } from 'src/base/paginate';
import { OrderLinesService } from 'src/order-lines';
import { ProductsService } from 'src/products';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
    private readonly orderLinesService : OrderLinesService,
    private readonly productsService : ProductsService
  ) {

  }

  async upsert(createOrderDto: CreateOrderDto): Promise<Order | null> {
    // Check if an order with the same reference already exists
    let existingOrder = await this.repository.findOne({ where: { reference: createOrderDto.reference } });

    if (existingOrder) {
      // Update the existing order if found
      existingOrder.clientId = createOrderDto.clientId; // Assuming you want to set this as well
      existingOrder.status = createOrderDto.status
      // Set other fields from createOrderDto as needed
      return await this.repository.save(existingOrder);
    } else {
      // Create a new order if not found
      const newOrder = new Order();
      newOrder.clientId = createOrderDto.clientId;
      newOrder.reference = createOrderDto.reference;
      newOrder.originalCreatedAt = createOrderDto.originalCreatedAt
      newOrder.totalAmount = createOrderDto.totalAmount.toString()
      newOrder.status = createOrderDto.status
      // Set other fields from createOrderDto as needed
      return await this.repository.save(newOrder);
    }
  }


  async create(createOrderDto: CreateOrderDto): Promise<Order | null> {
    const newOrder = new Order()
    newOrder.clientId = 1
    newOrder.reference = createOrderDto.reference;

    return await this.repository.save(newOrder)
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const order =  await this.repository.findOne({ where: { id } });
    const lineItems = await this.orderLinesService.getOrderLineItems(id)
    const lineItemsWithProducts = []
    for(const item of lineItems){
      const products = await this.productsService.query({pageSize: 1, pageNumber: 1, ean: item.product_ean, tenantId: item.clientId})
      const product = products.data[0]
      lineItemsWithProducts.push({...item, product})
    }

    return {...order, lineItems: lineItemsWithProducts}
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async getClientUnfulfilledOrders(clientId: number){
    return await this.repository.find({where : {clientId, status: Not(OrderStatus.FULLFILED)}})
  }

  async query(
    params: OrdersQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Order>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;

    let whereConditions: Partial<Order> = {}
    if (params.clientId) {
      whereConditions = { ...whereConditions, clientId: params.clientId}
    }
    if (params.reference) {
      whereConditions = { ...whereConditions, reference: params.reference }
    }
   
    if (params.status) {
      whereConditions = { ...whereConditions, status: params.status }
    }

    const [orders, count] = await this.repository.findAndCount({ where: whereConditions, order: {originalCreatedAt: 'DESC'}, take, skip })

    const mappedOrders = []

    for(const order of orders){
      const lineItems = this.orderLinesService.getOrderLineItems(order.id)
      mappedOrders.push(
        {
          ...order,
          lineItems
        }
      )
    }

    return {
      count,
      data: orders
    }
  }
}
