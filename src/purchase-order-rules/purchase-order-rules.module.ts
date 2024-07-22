import { Module } from '@nestjs/common';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';
import { PurchaseOrderRulesController } from './purchase-order-rules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderRule } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderRule])],
  controllers: [PurchaseOrderRulesController],
  providers: [PurchaseOrderRulesService],
  exports: [PurchaseOrderRulesService]
})
export class PurchaseOrderRulesModule {}
