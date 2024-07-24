import { Module } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { ProductAnalyticsController } from './product-analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnalytic } from './entities/product-analytic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAnalytic])],
  controllers: [ProductAnalyticsController],
  providers: [ProductAnalyticsService],
  exports: [ProductAnalyticsService]
})
export class ProductAnalyticsModule { }
