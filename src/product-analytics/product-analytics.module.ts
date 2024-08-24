import { Module } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnalytic } from './entities/product-analytic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAnalytic])],
  providers: [ProductAnalyticsService],
  exports: [ProductAnalyticsService]
})
export class ProductAnalyticsModule { }
