import { Injectable } from '@nestjs/common';
import { CreateInventorySyncDto } from './dto/create-inventory-sync.dto';
import { UpdateInventorySyncDto } from './dto/update-inventory-sync.dto';
import { JobConfiguration } from 'src/job-configurations';
import { InventoryService } from 'src/inventory/inventory.service';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';
import { Inventory } from 'src/inventory/entities';
import { WicsWmsConfig, WicsWmsConnectorService } from 'src/wics-wms-connector/wics-wms-connector.service';

@Injectable()
export class InventorySyncService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService,
    private readonly wicsWmsConnectorService: WicsWmsConnectorService,
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


  async handleSyncOngoingWmsInventory(config: OngoingWmsConfig, clientId) {
    const articles = await this.ongoingWmsConnectorService.getArticlesWithInventoryInfo(config);
    const inventories: Partial<Inventory>[] = []
    for (const article of articles) {
      const inventory = new Inventory()
      inventory.clientId = clientId
      inventory.article_number = article.articleNumber;
      inventory.product_ean = article.articleNumber;
      inventory.product_sku = article.articleNumber;
      inventory.number_of_book_items = article.inventory.numberOfBookedItems
      inventory.to_receive_number_of_items = article.inventory.toReceiveNumberOfItems
      inventory.stock_limit = article.stockLimit
      inventory.number_of_items = this.ongoingWmsConnectorService.extractTotalAvailableStock(article);
      inventory.actual_stock = this.ongoingWmsConnectorService.calculateAdjustmentQuantity({
        numberOfItems: inventory.number_of_items,
        numberOfBookedItems: inventory.number_of_book_items,
        numberOfIncomingItems: inventory.to_receive_number_of_items,
        stockLimit: article.stockLimit
      })

      inventories.push(inventory)
    }

    this.inventoryService.upserInventory(clientId, inventories as Inventory[])
  }
  
  async handleSyncWicsWmsInventory(config: WicsWmsConfig, clientId) {
    const response = await this.wicsWmsConnectorService.getArticlesInventory(config)
    const inventories: Partial<Inventory>[] = []
    for (const item of response.data.data) {
      const inventory = new Inventory()
      inventory.clientId = clientId;
      inventory.article_number = item.itemCode;
      inventory.product_ean = item.itemCode;
      inventory.product_sku = item.itemCode;
      // Summing up sellableNumberOfItems across all warehouses
      inventory.sellable_number_of_items = item.warehouses.reduce(
        (sum, warehouseInfo) => sum + warehouseInfo.nettoSalable, 0
      );

      inventories.push(inventory)
    }

    this.inventoryService.upserInventory(clientId, inventories as Inventory[])
  }


  async handleSyncInventoryJob(jobConfiguration: JobConfiguration) {
    const { entityReferenceId, config, entityType, tenantId } = jobConfiguration
    const warehouseManagemenSystem = await this.warehouseManagementSystemsService.findOne(entityReferenceId)

    try {
      if (warehouseManagemenSystem.name === 'ongoing') {
        await this.handleSyncOngoingWmsInventory(jobConfiguration.config as OngoingWmsConfig, tenantId)
      }
      if (warehouseManagemenSystem.name === 'wics') {
        await this.handleSyncWicsWmsInventory(jobConfiguration.config as WicsWmsConfig, tenantId)
      }
    }
    catch (e) {
      throw (e)
    }

    return true
  }
}
