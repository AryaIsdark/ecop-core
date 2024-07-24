import { Module } from '@nestjs/common';
import { OrderLinesService } from './order-lines.service';
import { OrderLinesController } from './order-lines.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderLine } from './entities';
import { ProductAnalyticsModule } from 'src/product-analytics';

@Module({
  imports: [TypeOrmModule.forFeature([OrderLine]), ProductAnalyticsModule],
  controllers: [OrderLinesController],
  providers: [OrderLinesService],
  exports: [OrderLinesService]
})
export class OrderLinesModule {}
