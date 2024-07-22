import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShopifyConnectorService } from './shopify-connector.service';
import { CreateShopifyConnectorDto } from './dto/create-shopify-connector.dto';
import { UpdateShopifyConnectorDto } from './dto/update-shopify-connector.dto';

@Controller('shopify-connector')
export class ShopifyConnectorController {
  constructor(private readonly shopifyConnectorService: ShopifyConnectorService) {}

  @Post()
  create(@Body() createShopifyConnectorDto: CreateShopifyConnectorDto) {
    return this.shopifyConnectorService.create(createShopifyConnectorDto);
  }

  @Get()
  findAll() {
    return this.shopifyConnectorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopifyConnectorService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShopifyConnectorDto: UpdateShopifyConnectorDto) {
    return this.shopifyConnectorService.update(+id, updateShopifyConnectorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopifyConnectorService.remove(+id);
  }
}
