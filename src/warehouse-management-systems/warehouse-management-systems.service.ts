import { Injectable } from '@nestjs/common';
import { CreateWarehouseManagementSystemDto } from './dto/create-warehouse-management-system.dto';
import { UpdateWarehouseManagementSystemDto } from './dto/update-warehouse-management-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class WarehouseManagementSystemsService {
  constructor(
    @InjectRepository(WarehouseManagementSystem)
    private readonly repository: Repository<WarehouseManagementSystem>,
  ) {

  }
  create(createWarehouseManagementSystemDto: CreateWarehouseManagementSystemDto) {
    return 'This action adds a new warehouseManagementSystem';
  }

  findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  update(id: number, updateWarehouseManagementSystemDto: UpdateWarehouseManagementSystemDto) {
    return `This action updates a #${id} warehouseManagementSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} warehouseManagementSystem`;
  }
}
