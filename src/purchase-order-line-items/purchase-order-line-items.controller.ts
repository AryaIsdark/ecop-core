import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PurchaseOrderLineItemsService } from './purchase-order-line-items.service';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { ExportFormat } from 'src/base/export-format';

@Controller('purchase-order-line-items')
export class PurchaseOrderLineItemsController {
  constructor(private readonly purchaseOrderLineItemsService: PurchaseOrderLineItemsService) {}

  @Post()
  create(@Body() createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto) {
    return this.purchaseOrderLineItemsService.create(createPurchaseOrderLineItemDto);
  }

  @Get()
  findAll() {
    return this.purchaseOrderLineItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrderLineItemsService.findOne(+id);
  }
  
  @Get('export')
  export(@Query('purchaseOrderId') purchaseOrderId: string, @Query('exportFormat') exportFormat: ExportFormat) {
    return this.purchaseOrderLineItemsService.export(+purchaseOrderId, exportFormat);
  }

  @Patch(':id')
  update(@Body() updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto) {
    return this.purchaseOrderLineItemsService.update(updatePurchaseOrderLineItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrderLineItemsService.remove(+id);
  }
}
