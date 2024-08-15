import { Injectable } from '@nestjs/common';
import { CreateInventorySyncDto } from './dto/create-inventory-sync.dto';
import { UpdateInventorySyncDto } from './dto/update-inventory-sync.dto';
import { JobConfiguration } from 'src/job-configurations';
import { InventoryService } from 'src/inventory/inventory.service';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';

@Injectable()
export class InventorySyncService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService,
    private readonly warehouseManagementSystemsService: WarehouseManagementSystemsService) {

  }

  create(createInventorySyncDto: CreateInventorySyncDto) {
    return 'This action adds a new inventorySync';
  }

  findAll() {
    return `This action returns all inventorySync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventorySync`;
  }

  update(id: number, updateInventorySyncDto: UpdateInventorySyncDto) {
    return `This action updates a #${id} inventorySync`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventorySync`;
  }

  async handleSyncOngoingWmsInventory(config: OngoingWmsConfig){
    const response = this.ongoingWmsConnectorService.getArticlesInventory(config as unknown as OngoingWmsConfig)
  }


  async handleSyncInventoryJob(jobConfiguration: JobConfiguration) {
    const { entityReferenceId, config, entityType, tenantId } = jobConfiguration
    const warehouseManagemenSystem = await this.warehouseManagementSystemsService.findOne(entityReferenceId)

    try {
      if (warehouseManagemenSystem.name === 'ongoing') {
        await this.handleSyncOngoingWmsInventory(jobConfiguration.config as OngoingWmsConfig)
      }
    }
    catch (e) {
      throw (e)
    }

    return true
  }
}
