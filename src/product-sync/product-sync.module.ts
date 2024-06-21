import { Module } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { ProductSyncController } from './product-sync.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProductSyncController],
  providers: [ProductSyncService],
  exports : [ProductSyncService]
})
export class ProductSyncModule {}
