import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductDescriptionService } from './product-description.service';
import { CreateProductDescriptionDto } from './dto/create-product-description.dto';
import { UpdateProductDescriptionDto } from './dto/update-product-description.dto';

@Controller('product-description')
export class ProductDescriptionController {
  constructor(private readonly productDescriptionService: ProductDescriptionService) {}

  @Post()
  create(@Body() createProductDescriptionDto: CreateProductDescriptionDto) {
    return this.productDescriptionService.create(createProductDescriptionDto);
  }

  @Get()
  findAll() {
    return this.productDescriptionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDescriptionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDescriptionDto: UpdateProductDescriptionDto) {
    return this.productDescriptionService.update(+id, updateProductDescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productDescriptionService.remove(+id);
  }
}
