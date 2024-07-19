import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';
import { CreatePurchaseOrderRuleDto } from './dto/create-purchase-order-rule.dto';
import { UpdatePurchaseOrderRuleDto } from './dto/update-purchase-order-rule.dto';

@Controller('purchase-order-rules')
export class PurchaseOrderRulesController {
  constructor(private readonly purchaseOrderRulesService: PurchaseOrderRulesService) {}

  @Post()
  create(@Body() createPurchaseOrderRuleDto: CreatePurchaseOrderRuleDto) {
    return this.purchaseOrderRulesService.create(createPurchaseOrderRuleDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrderRulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderRulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseOrderRuleDto: UpdatePurchaseOrderRuleDto) {
    return this.purchaseOrderRulesService.update(+id, updatePurchaseOrderRuleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderRulesService.remove(+id);
  }
}
