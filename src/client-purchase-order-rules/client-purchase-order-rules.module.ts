import { Module } from '@nestjs/common';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPurchaseOrderRule } from './entities';
import { PurchaseOrderRulesModule } from 'src/purchase-order-rules';

@Module({
  imports: [TypeOrmModule.forFeature([ClientPurchaseOrderRule]), PurchaseOrderRulesModule],
  providers: [ClientPurchaseOrderRulesService],
  exports: [ClientPurchaseOrderRulesService]
})
export class ClientPurchaseOrderRulesModule {}
