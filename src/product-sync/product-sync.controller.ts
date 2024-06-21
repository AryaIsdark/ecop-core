import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';
import { CreateProductSyncDto } from './dto/create-product-sync.dto';
import { UpdateProductSyncDto } from './dto/update-product-sync.dto';

@Controller('product-sync')
export class ProductSyncController {
  constructor(private readonly productSyncService: ProductSyncService) { }

}
