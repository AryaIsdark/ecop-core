import { Module } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [ProductSyncService],
  exports : [ProductSyncService]
})
export class ProductSyncModule {}
