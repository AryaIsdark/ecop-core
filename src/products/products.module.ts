import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { InventoryModule } from 'src/inventory/inventory.module';
import { ProductMediaModule, ProductMediaService } from 'src/product-media';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SuppliersModule, InventoryModule, ProductMediaModule],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
