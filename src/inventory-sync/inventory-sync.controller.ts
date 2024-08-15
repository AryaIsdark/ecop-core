import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventorySyncService } from './inventory-sync.service';
import { CreateInventorySyncDto } from './dto/create-inventory-sync.dto';
import { UpdateInventorySyncDto } from './dto/update-inventory-sync.dto';

@Controller('inventory-sync')
export class InventorySyncController {
  constructor(private readonly inventorySyncService: InventorySyncService) {}

  @Post()
  create(@Body() createInventorySyncDto: CreateInventorySyncDto) {
    return this.inventorySyncService.create(createInventorySyncDto);
  }

  @Get()
  findAll() {
    return this.inventorySyncService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventorySyncService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventorySyncDto: UpdateInventorySyncDto) {
    return this.inventorySyncService.update(+id, updateInventorySyncDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventorySyncService.remove(+id);
  }
}
