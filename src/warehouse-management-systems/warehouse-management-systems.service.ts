import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseManagementSystemDto } from './dto/create-warehouse-management-system.dto';
import { UpdateWarehouseManagementSystemDto } from './dto/update-warehouse-management-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';
import { Repository } from 'typeorm';
import { CreatePurchaseOrderDto } from 'src/purchase-orders';
import { ClientsService, WarehouseManagementSystemJobConfiguration } from 'src/clients';
import { WicsWmsConfig, WicsWmsConnectorService } from 'src/wics-wms-connector/wics-wms-connector.service';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { Supplier } from 'src/suppliers';

@Injectable()
export class WarehouseManagementSystemsService {
  constructor(
    @InjectRepository(WarehouseManagementSystem)
    private readonly repository: Repository<WarehouseManagementSystem>,
    private readonly wicsConnectorService: WicsWmsConnectorService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService
  ) {

  }

  async publishPurchaseOrder(correspondingWMS: WarehouseManagementSystem, config: WicsWmsConfig | OngoingWmsConfig, payload: CreatePurchaseOrderDto, supplier?: Supplier) {
    try {
      if (correspondingWMS.name === 'wics') {
        return await this.wicsConnectorService.createPurchaseOrder(config, payload)
      }

      if (correspondingWMS.name === 'ongoing') {
        return await this.ongoingWmsConnectorService.createPurchaseOrder(config as OngoingWmsConfig, payload, supplier)
      }
    }
    catch (e) {
      console.error(e)
    }
  }

  create(createWarehouseManagementSystemDto: CreateWarehouseManagementSystemDto) {
    return 'This action adds a new warehouseManagementSystem';
  }

  findAll() {
    return this.repository.find()
  }

  async findOne(id: number) {
    return await this.repository.findOne({ where: { id } });
  }

  update(id: number, updateWarehouseManagementSystemDto: UpdateWarehouseManagementSystemDto) {
    return `This action updates a #${id} warehouseManagementSystem`;
  }

  remove(id: number) {
    return `This action removes a #${id} warehouseManagementSystem`;
  }
}
