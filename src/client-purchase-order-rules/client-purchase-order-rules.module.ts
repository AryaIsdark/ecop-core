import { Module } from '@nestjs/common';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';
import { ClientPurchaseOrderRulesController } from './client-purchase-order-rules.controller';

@Module({
  controllers: [ClientPurchaseOrderRulesController],
  providers: [ClientPurchaseOrderRulesService],
})
export class ClientPurchaseOrderRulesModule {}
