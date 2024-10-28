import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWarehouseManagementSystemDto } from './dto/create-warehouse-management-system.dto';
import { UpdateWarehouseManagementSystemDto } from './dto/update-warehouse-management-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';
import { Repository } from 'typeorm';
import { CreatePurchaseOrderDto } from 'src/purchase-orders';
import { ClientsService, WarehouseManagementSystemJobConfiguration } from 'src/clients';
import { WicsWmsConfig, WicsWmsConnectorService } from 'src/wics-wms-connector/wics-wms-connector.service';
import { OngoingWmsConfig } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';

@Injectable()
export class WarehouseManagementSystemsService {
  constructor(
    @InjectRepository(WarehouseManagementSystem)
    private readonly repository: Repository<WarehouseManagementSystem>,
    private readonly wicsConnectorService: WicsWmsConnectorService
  ) {

  }

  async publishPurchaseOrder(correspondingWMS: WarehouseManagementSystem, config: WicsWmsConfig | OngoingWmsConfig, payload: CreatePurchaseOrderDto) {
    try {
      if (correspondingWMS.name === 'wics') {
        return await this.wicsConnectorService.createPurchaseOrder(config, payload)
      }

      if (correspondingWMS.name === 'ongoing') {
        // Handle ongoing wms create PO
        throw NotFoundException
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
