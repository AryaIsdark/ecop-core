import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { CreateProductAnalyticDto } from './dto/create-product-analytic.dto';
import { UpdateProductAnalyticDto } from './dto/update-product-analytic.dto';

@Controller('product-analytics')
export class ProductAnalyticsController {
  constructor(private readonly productAnalyticsService: ProductAnalyticsService) {}

  @Post()
  create(@Body() createProductAnalyticDto: CreateProductAnalyticDto) {
    return this.productAnalyticsService.create(createProductAnalyticDto);
  }

  @Get()
  findAll() {
    return this.productAnalyticsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productAnalyticsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductAnalyticDto: UpdateProductAnalyticDto) {
    return this.productAnalyticsService.update(+id, updateProductAnalyticDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productAnalyticsService.remove(+id);
  }
}
