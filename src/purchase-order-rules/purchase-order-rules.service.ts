import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderRuleDto } from './dto/create-purchase-order-rule.dto';
import { UpdatePurchaseOrderRuleDto } from './dto/update-purchase-order-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderRule } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class PurchaseOrderRulesService {
  constructor(
    @InjectRepository(PurchaseOrderRule)
    private readonly repository: Repository<PurchaseOrderRule>,

  ) {
    
  }

  create(createPurchaseOrderRuleDto: CreatePurchaseOrderRuleDto) {
    return 'This action adds a new purchaseOrderRule';
  }

  findAll() {
    return `This action returns all purchaseOrderRules`;
  }

  findOne(id: number) {
    return this.repository.findOne({where: {id}})
  }

  update(id: number, updatePurchaseOrderRuleDto: UpdatePurchaseOrderRuleDto) {
    return `This action updates a #${id} purchaseOrderRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderRule`;
  }
}
