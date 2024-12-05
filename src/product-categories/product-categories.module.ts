import { Module } from '@nestjs/common';
import { ProductCategoriesService } from './product-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductCategory])],
  providers: [ProductCategoriesService],
  exports : [ProductCategoriesService]
})
export class ProductCategoriesModule {}
