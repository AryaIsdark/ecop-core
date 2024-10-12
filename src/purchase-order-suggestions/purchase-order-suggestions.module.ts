import { Module } from '@nestjs/common';
import { PurchaseOrderSuggestionsService } from './purchase-order-suggestions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseOrderSuggestion } from './entities/purchase-order-suggestion.entity';
import { ProductsModule } from 'src/products';
import { OrderLinesModule } from 'src/order-lines';
import { Inventory } from 'src/inventory/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrderSuggestion, Inventory]), ProductsModule, OrderLinesModule],
  providers: [PurchaseOrderSuggestionsService],
  exports : [PurchaseOrderSuggestionsService]
})
export class PurchaseOrderSuggestionsModule {}
