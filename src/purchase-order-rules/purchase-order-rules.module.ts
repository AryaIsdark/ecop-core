import { Module } from '@nestjs/common';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderRule } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderRule])],
  providers: [PurchaseOrderRulesService],
  exports: [PurchaseOrderRulesService]
})
export class PurchaseOrderRulesModule {}
