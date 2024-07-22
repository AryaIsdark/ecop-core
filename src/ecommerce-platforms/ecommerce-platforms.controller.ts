import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EcommercePlatformsService } from './ecommerce-platforms.service';
import { CreateEcommercePlatformDto } from './dto/create-ecommerce-platform.dto';
import { UpdateEcommercePlatformDto } from './dto/update-ecommerce-platform.dto';

@Controller('ecommerce-platforms')
export class EcommercePlatformsController {
  constructor(private readonly ecommercePlatformsService: EcommercePlatformsService) {}

  @Post()
  create(@Body() createEcommercePlatformDto: CreateEcommercePlatformDto) {
    return this.ecommercePlatformsService.create(createEcommercePlatformDto);
  }

  @Get()
  findAll() {
    return this.ecommercePlatformsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ecommercePlatformsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEcommercePlatformDto: UpdateEcommercePlatformDto) {
    return this.ecommercePlatformsService.update(+id, updateEcommercePlatformDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ecommercePlatformsService.remove(+id);
  }
}
