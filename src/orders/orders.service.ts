import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrdersQueryParams } from './entities';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Paginate } from 'src/base/paginate';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {

  }

  async upsert(createOrderDto: CreateOrderDto): Promise<Order | null> {
    // Check if an order with the same reference already exists
    let existingOrder = await this.repository.findOne({ where: { reference: createOrderDto.reference } });

    if (existingOrder) {
      // Update the existing order if found
      existingOrder.clientId = createOrderDto.clientId; // Assuming you want to set this as well
      // Set other fields from createOrderDto as needed
      return await this.repository.save(existingOrder);
    } else {
      // Create a new order if not found
      const newOrder = new Order();
      newOrder.clientId = createOrderDto.clientId;
      newOrder.reference = createOrderDto.reference;
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

  findOne(id: number) {
    return this.repository.find({ where: { id } });
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }

  async query(
    params: OrdersQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Order>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;

    let whereConditions: Partial<Order> = {}
    if (params.clientId) {
      whereConditions = { ...whereConditions, clientId: params.clientId }
    }
    if (params.reference) {
      whereConditions = { ...whereConditions, reference: params.reference }
    }

    const [orders, count] = await this.repository.findAndCount({ where: whereConditions, take, skip })


    return {
      count,
      data: orders
    }
  }
}
