import { Module } from '@nestjs/common';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';
import { ClientPurchaseOrderRulesController } from './client-purchase-order-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPurchaseOrderRule } from './entities';
import { PurchaseOrderRulesModule } from 'src/purchase-order-rules';

@Module({
  imports: [TypeOrmModule.forFeature([ClientPurchaseOrderRule]), PurchaseOrderRulesModule],
  controllers: [ClientPurchaseOrderRulesController],
  providers: [ClientPurchaseOrderRulesService],
  exports: [ClientPurchaseOrderRulesService]
})
export class ClientPurchaseOrderRulesModule {}
