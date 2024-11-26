import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';


@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly repository: Repository<Subscription>,

  ) {

  }

  async findOne(id: number) {
    return await this.repository.findOne({ where: { id } })
  }

}
