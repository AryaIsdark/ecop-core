import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) { }
  
  @Get(':clientId/order-sync-job-configurations')
  getOrderSyncJobConfigurations(@Param('clientId') clientId: string) {
    return this.clientsService.getOrderSyncJobConfigurations(+clientId);
  }

  @Get(':clientId/product-sync-job-configurations')
  getProductSyncJobConfigurations(@Param('clientId') clientId: string) {
    return this.clientsService.getProductSyncJobConfigurations(+clientId);
  }

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Get(':id/supplier-options')
  getTenantSupplierOptions(@Param('id') id: string) {
    return this.clientsService.getTenantSupplierOptions(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(+id);
  }

}
