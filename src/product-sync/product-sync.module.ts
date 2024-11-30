import { Module } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ProductsModule } from 'src/products/products.module';
import { ProductMediaModule } from 'src/product-media';

@Module({
  imports: [ProductsModule, ProductMediaModule],
  providers: [ProductSyncService],
  exports : [ProductSyncService]
})
export class ProductSyncModule {}
