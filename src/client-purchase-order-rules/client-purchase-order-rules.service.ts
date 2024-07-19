import { Injectable } from '@nestjs/common';
import { CreateClientPurchaseOrderRuleDto } from './dto/create-client-purchase-order-rule.dto';
import { UpdateClientPurchaseOrderRuleDto } from './dto/update-client-purchase-order-rule.dto';

@Injectable()
export class ClientPurchaseOrderRulesService {
  create(createClientPurchaseOrderRuleDto: CreateClientPurchaseOrderRuleDto) {
    return 'This action adds a new clientPurchaseOrderRule';
  }

  findAll() {
    return `This action returns all clientPurchaseOrderRules`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientPurchaseOrderRule`;
  }

  update(id: number, updateClientPurchaseOrderRuleDto: UpdateClientPurchaseOrderRuleDto) {
    return `This action updates a #${id} clientPurchaseOrderRule`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientPurchaseOrderRule`;
  }
}
