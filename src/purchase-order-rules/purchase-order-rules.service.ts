import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderRuleDto } from './dto/create-purchase-order-rule.dto';
import { UpdatePurchaseOrderRuleDto } from './dto/update-purchase-order-rule.dto';

@Injectable()
export class PurchaseOrderRulesService {
  create(createPurchaseOrderRuleDto: CreatePurchaseOrderRuleDto) {
    return 'This action adds a new purchaseOrderRule';
  }

  findAll() {
    return `This action returns all purchaseOrderRules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderRule`;
  }

  update(id: number, updatePurchaseOrderRuleDto: UpdatePurchaseOrderRuleDto) {
    return `This action updates a #${id} purchaseOrderRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrderRule`;
  }
}
