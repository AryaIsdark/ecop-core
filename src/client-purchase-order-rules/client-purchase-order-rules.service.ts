import { Injectable } from '@nestjs/common';
import { CreateClientPurchaseOrderRuleDto } from './dto/create-client-purchase-order-rule.dto';
import { UpdateClientPurchaseOrderRuleDto } from './dto/update-client-purchase-order-rule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientPurchaseOrderRule } from './entities';
import { PurchaseOrderRulesService } from 'src/purchase-order-rules';

@Injectable()
export class ClientPurchaseOrderRulesService {

  constructor(
    @InjectRepository(ClientPurchaseOrderRule)
    private readonly repository: Repository<ClientPurchaseOrderRule>,
    private readonly purchaseOrdeRulesService: PurchaseOrderRulesService,

  ) {
    
  }

  async query(params: Partial<ClientPurchaseOrderRule>){

    let whereConditions : Partial<ClientPurchaseOrderRule>;

    if(params.clientId){
      whereConditions = {...whereConditions, clientId : params.clientId}
    }

    const results = await this.repository.find({where: whereConditions})

    const mappedResults = []

    for(const result of results){
      const purchaseOrderRule = await this.purchaseOrdeRulesService.findOne(result.purchaseOrderRuleId)
      mappedResults.push({...result, purchaseOrderRule})
    }

    return mappedResults
  }

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
