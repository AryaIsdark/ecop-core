import { Injectable } from '@nestjs/common';
import { CreateInventorySyncDto } from './dto/create-inventory-sync.dto';
import { UpdateInventorySyncDto } from './dto/update-inventory-sync.dto';
import { JobConfiguration } from 'src/job-configurations';
import { InventoryService } from 'src/inventory/inventory.service';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';
import { Inventory } from 'src/inventory/entities';
import { WicsWmsConfig, WicsWmsConnectorService } from 'src/wics-wms-connector/wics-wms-connector.service';
import { PurchaseOrderLineItemsService } from 'src/purchase-order-line-items';
import { PurchaseOrderStatus, PurchaseOrdersService } from 'src/purchase-orders';
import { Order, OrderStatus, OrdersService } from 'src/orders';
import { OrderLine, OrderLinesService } from 'src/order-lines';
import { Not } from 'typeorm';

@Injectable()
export class InventorySyncService {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService,
    private readonly purchaseOrderLineItemsService: PurchaseOrderLineItemsService,
    private readonly purchaseOrdersService: PurchaseOrdersService,
    private readonly orderLinesService : OrderLinesService,
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

  

  async getNumberOfBookedItems(clientId: number, product_ean: string, unfulfilledOrderLines: OrderLine[]): Promise<number> {
    let numberOfBookedItems = 0

    for(const lineItem of unfulfilledOrderLines){
      if(lineItem.product_ean === product_ean){
        numberOfBookedItems += lineItem.quantity
      }
    }

    return numberOfBookedItems;

  }

  async getToReceiveNumberOfItems(clientId: number, product_ean: string): Promise<number> {
    let toReceiveNumberOfItems = 0
    const toReceivePurchaseOrders = await this.purchaseOrdersService.query({ clientId, status: PurchaseOrderStatus.Created })
    for (const po of toReceivePurchaseOrders) {
      const purchaseOrderLines = await this.purchaseOrderLineItemsService.query({ purchaseOrderId: po.id, product_ean })
      if (purchaseOrderLines[0]?.id) {
        toReceiveNumberOfItems += purchaseOrderLines[0].quantity
      }
    }

    return toReceiveNumberOfItems;

  }

  async handleSyncOngoingWmsInventory(config: OngoingWmsConfig, clientId) {
    const unfulfilledOrderLines = await this.orderLinesService.getClientUnfullfiledOrderLines(clientId)
  
    const response = await this.ongoingWmsConnectorService.getArticlesInventory(config)
    const inventories: Partial<Inventory>[] = []
    for (const item of response.data) {
      const inventory = new Inventory()
      inventory.clientId = clientId;
      inventory.article_number = item.articleNumber;
      inventory.product_ean = item.articleNumber;
      inventory.product_sku = item.articleNumber;
      // Summing up sellableNumberOfItems across all warehouses
      inventory.sellable_number_of_items = item.inventoryPerWarehouse.reduce(
        (sum, warehouseInfo) => sum + warehouseInfo.sellableNumberOfItems, 0
      );

      inventory.to_receive_number_of_items = await this.getToReceiveNumberOfItems(clientId, inventory.product_ean)
      inventory.number_of_book_items = await this.getNumberOfBookedItems(clientId, inventory.product_ean,  unfulfilledOrderLines)

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
