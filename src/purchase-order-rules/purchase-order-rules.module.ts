import { Module } from '@nestjs/common';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';
import { PurchaseOrderRulesController } from './purchase-order-rules.controller';

@Module({
  controllers: [PurchaseOrderRulesController],
  providers: [PurchaseOrderRulesService],
})
export class PurchaseOrderRulesModule {}
