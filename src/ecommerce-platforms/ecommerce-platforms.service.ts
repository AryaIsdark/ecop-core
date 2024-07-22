import { Injectable } from '@nestjs/common';
import { CreateEcommercePlatformDto } from './dto/create-ecommerce-platform.dto';
import { UpdateEcommercePlatformDto } from './dto/update-ecommerce-platform.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EcommercePlatform } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class EcommercePlatformsService {
  constructor(
    @InjectRepository(EcommercePlatform)
    private readonly repository: Repository<EcommercePlatform>,
  ) {

  }

  create(createEcommercePlatformDto: CreateEcommercePlatformDto) {
    return 'This action adds a new ecommercePlatform';
  }

  findAll() {
    return `This action returns all ecommercePlatforms`;
  }

  async findOne(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  update(id: number, updateEcommercePlatformDto: UpdateEcommercePlatformDto) {
    return `This action updates a #${id} ecommercePlatform`;
  }

  remove(id: number) {
    return `This action removes a #${id} ecommercePlatform`;
  }
}
