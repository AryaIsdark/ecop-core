import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';
import { CreateWarehouseManagementSystemDto } from './dto/create-warehouse-management-system.dto';
import { UpdateWarehouseManagementSystemDto } from './dto/update-warehouse-management-system.dto';

@Controller('warehouse-management-systems')
export class WarehouseManagementSystemsController {
  constructor(private readonly warehouseManagementSystemsService: WarehouseManagementSystemsService) {}

  @Post()
  create(@Body() createWarehouseManagementSystemDto: CreateWarehouseManagementSystemDto) {
    return this.warehouseManagementSystemsService.create(createWarehouseManagementSystemDto);
  }

  @Get()
  findAll() {
    return this.warehouseManagementSystemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseManagementSystemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWarehouseManagementSystemDto: UpdateWarehouseManagementSystemDto) {
    return this.warehouseManagementSystemsService.update(+id, updateWarehouseManagementSystemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseManagementSystemsService.remove(+id);
  }
}
