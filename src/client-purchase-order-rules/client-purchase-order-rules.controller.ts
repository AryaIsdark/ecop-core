import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';
import { CreateClientPurchaseOrderRuleDto } from './dto/create-client-purchase-order-rule.dto';
import { UpdateClientPurchaseOrderRuleDto } from './dto/update-client-purchase-order-rule.dto';

@Controller('client-purchase-order-rules')
export class ClientPurchaseOrderRulesController {
  constructor(private readonly clientPurchaseOrderRulesService: ClientPurchaseOrderRulesService) {}

  @Post()
  create(@Body() createClientPurchaseOrderRuleDto: CreateClientPurchaseOrderRuleDto) {
    return this.clientPurchaseOrderRulesService.create(createClientPurchaseOrderRuleDto);
  }

  @Get()
  findAll() {
    return this.clientPurchaseOrderRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientPurchaseOrderRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientPurchaseOrderRuleDto: UpdateClientPurchaseOrderRuleDto) {
    return this.clientPurchaseOrderRulesService.update(+id, updateClientPurchaseOrderRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientPurchaseOrderRulesService.remove(+id);
  }
}
