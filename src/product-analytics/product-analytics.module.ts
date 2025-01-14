import { Module } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnalytic } from './entities/product-analytic.entity';
import { ProductsModule } from 'src/products';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAnalytic]), ProductsModule],
  providers: [ProductAnalyticsService],
  exports: [ProductAnalyticsService]
})
export class ProductAnalyticsModule { }
