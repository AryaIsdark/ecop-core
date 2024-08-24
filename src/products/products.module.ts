import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), SuppliersModule, InventoryModule],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
