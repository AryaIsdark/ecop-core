import { Injectable } from '@nestjs/common';
import { EntityType, JobConfiguration } from 'src/job-configurations';
import { InventoryService } from 'src/inventory/inventory.service';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';
import { Inventory } from 'src/inventory/entities';
import { WicsWmsConfig, WicsWmsConnectorService } from 'src/wics-wms-connector/wics-wms-connector.service';
import { EcommercePlatformsService } from 'src/ecommerce-platforms';
import { Product, ProductTrendingScore, ProductsService } from 'src/products';
import { ShopifyConfig, ShopifyConnectorService } from 'src/shopify-connector/shopify-connector.service';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';
import { ProductAnalyticsService, TRENDING_RANGE } from 'src/product-analytics';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export type InventoryStockSuggestion = {
  product_ean: string,
  stockSuggestion: number,
}

export enum ShopStockModel {
  TEST = 'test',
  WAREHOUSE_FIRST_SUPPLIER_SECOND = 'warehouseFirstSupplierSecond',
  SUPPLIER_FIRST_WAREHOUSE_SECOND = 'supplierFirstWarehouseSecond',
  SUPPLIER_ONLY = 'supplierOnly',
  WAREHOUSE_ONLY = 'warehouseOnly',
  COMBINE_WAREHOUSE_AND_SUPPLIERS = 'combineWarehouseAndSuppliers'
}

@Injectable()
export class InventorySyncService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository : Repository<Inventory>,
    private readonly inventoryService: InventoryService,
    private readonly shopifyConnectorService: ShopifyConnectorService,
    private readonly productsService: ProductsService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService,
    private readonly wicsWmsConnectorService: WicsWmsConnectorService,
    private readonly ecommercePlatformService: EcommercePlatformsService,
    private readonly warehouseManagementSystemsService: WarehouseManagementSystemsService,
    private readonly productAnalyticService : ProductAnalyticsService
    ) {
  }

  async handleAdjustStockMinimumReorder(jobConfiguration: JobConfiguration){
    const currentDate = new Date();
    const dateFrom = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    let inventoryUpdates : Partial<Inventory>[] = []

    const trendingProducts = await this.productsService.query({pageNumber: 1, pageSize: 1000, tenantId: jobConfiguration.tenantId, trending_score: ProductTrendingScore.HIGH})
    
    for(const product of trendingProducts.data){
      let orderCounts = 0
      const inventory = await this.inventoryService.findWithEan(product.ean_normalized, product.tenantId)
      const analytics = await this.productAnalyticService.getOrderQuantityForGivenRange(product.ean_normalized, dateFrom, currentDate)
      for(const  analytic of analytics){
        orderCounts = orderCounts + analytic.count 
      }
      inventory.minimum_reorder_amount = orderCounts
      inventoryUpdates.push(inventory)
    }
    try{
      await this.inventoryRepository.save(inventoryUpdates)
    }
    catch(e){
      console.error(e)
    }
    
  }

  getStockBalance(inventory: Inventory, availableStock: number) {
    const stock_balance = availableStock - inventory.number_of_book_items - inventory.stock_limit
    if (inventory.number_of_book_items > 0) {
      return stock_balance
    }

    return 0
  }

  async handleSyncOngoingWmsInventory(config: OngoingWmsConfig, clientId) {
    const articles = await this.ongoingWmsConnectorService.getArticlesWithInventoryInfo(config);
    let count = 0
    const inventories: Partial<Inventory>[] = []
    for (const article of articles) {

      const availableStock = article.inventoryInfo.numberOfItems + article.inventoryInfo.toReceiveNumberOfItems;
      const newStockLimit = article.stockLimit === 1 ? 0 : article.stockLimit // this is temporary
      const inventory = new Inventory()
      inventory.clientId = clientId;
      inventory.article_number = article.articleNumber;
      inventory.product_ean = article.articleNumber;
      inventory.product_sku = article.articleNumber;
      inventory.sellable_number_of_items = article.inventoryInfo.sellableNumberOfItems
      inventory.number_of_book_items = article.inventoryInfo.numberOfBookedItems
      inventory.number_of_items = article.inventoryInfo.numberOfItems
      inventory.to_receive_number_of_items = article.inventoryInfo.toReceiveNumberOfItems
      inventory.stock_limit = article.stockLimit ?? 0// this is temporary
      inventory.actual_stock = inventory.sellable_number_of_items + inventory.to_receive_number_of_items
      inventory.stock_need = availableStock - inventory.number_of_book_items - inventory.stock_limit;
      inventory.stock_balance = this.getStockBalance(inventory, availableStock);

      inventories.push(inventory)
    }

    this.inventoryService.upserInventory(clientId, inventories as Inventory[])
  }

  async handleSyncWicsWmsInventory(config: WicsWmsConfig, clientId) {
    const wicsStocks = await this.wicsWmsConnectorService.getArticlesInventory(config)
    const inventories: Partial<Inventory>[] = []
    for (const item of wicsStocks) {
      const inventory = new Inventory()
      inventory.clientId = clientId;
      inventory.stock_limit = inventory.stock_limit ?? 0
      inventory.article_number = item.itemCode;
      inventory.product_ean = item.itemCode;
      inventory.product_sku = item.itemCode;
      inventory.sellable_number_of_items = item.nettoSalable
      inventory.number_of_items = item.physical
      inventory.to_receive_number_of_items = item.announced
      inventory.actual_stock = item.nettoSalable + item.announced
      inventory.stock_balance = inventory.actual_stock - inventory.stock_limit;
      inventories.push(inventory)
    }

    this.inventoryService.upserInventory(clientId, inventories as Inventory[])
  }

  getStockSuggestionBasedOnModel(model: ShopStockModel, supplierStock: number, warehouseStock: number): number {
    if (model === ShopStockModel.TEST) {
      return 111
    }

    if (model === ShopStockModel.COMBINE_WAREHOUSE_AND_SUPPLIERS) {
      return warehouseStock + supplierStock
    }

    if (model === ShopStockModel.WAREHOUSE_FIRST_SUPPLIER_SECOND) {
      return warehouseStock ?? supplierStock
    }
    if (model === ShopStockModel.SUPPLIER_FIRST_WAREHOUSE_SECOND) {
      return supplierStock ?? warehouseStock
    }
    if (model === ShopStockModel.SUPPLIER_ONLY) {
      return supplierStock
    }
    if (model === ShopStockModel.WAREHOUSE_ONLY) {
      return warehouseStock
    }

    return 0
  }


  findSupplierProductWithHighestStockForGivenProduct(products: Product[]): Product | null {
    if (products.length === 0) return null;
  
    return products.reduce((prev, current) => {
      const prevStock = parseFloat(prev.stock || '0');
      const currentStock = parseFloat(current.stock || '0');
      return currentStock > prevStock ? current : prev;
    });
  }

  getProductSupplierStock_deprecated(product: Product, products: Product[]) {
    if(!product){
      return 0
    }
    const filteredProducts = products.filter((p) => product.ean === p.ean);
    // Use Math.max to find the highest stock among the filtered products
    const highestSupplierStock = filteredProducts.reduce((maxStock, p) => {
      const stock = parseInt(p.stock, 10);
      return Math.max(maxStock, stock);
    }, 0);
    return highestSupplierStock;
  }

  getProductSupplierStockMap(products: Product[]): Map<string, number> {
    const supplierStockMap = new Map<string, number>();
    products.forEach((p) => {
      const stock = supplierStockMap.get(normalizeEAN(p.ean)) || 0;
      supplierStockMap.set(normalizeEAN(p.ean), stock + parseInt(p.stock));
    });
    return supplierStockMap;
  }

   parseStockValue(stock: string | number | null | undefined): number {
    if (stock == null) return 0;
  
    if (typeof stock === 'number') return stock;
  
    if (typeof stock === 'string') {
      const numericPart = stock.match(/\d+/); // grabs the number part
      if (numericPart) {
        return parseInt(numericPart[0], 10);
      }
    }
  
    return 0;
  }

  async getStockAdjustmentForClientStore(clientId: number, model: ShopStockModel): Promise<InventoryStockSuggestion[]> {
    const inventories = await this.inventoryService.getClientInventories(clientId);
    const products = await this.productsService.getClientProducts(clientId);
    const suggestions: InventoryStockSuggestion[] = [];

    for (const inventory of inventories) {
        const normalizedEAN = normalizeEAN(inventory.product_ean);
        const matchingProducts = products.filter((product)=> normalizeEAN(product.ean) === normalizedEAN)
        const warehouseStock = inventory.actual_stock || 0;
        const supplierProductWithHighestStock = this.findSupplierProductWithHighestStockForGivenProduct(matchingProducts);
        const supplierStock = this.parseStockValue(supplierProductWithHighestStock?.stock);
        const stockSuggestion = this.getStockSuggestionBasedOnModel(model,supplierStock,warehouseStock);      
        suggestions.push({ product_ean: inventory.product_ean, stockSuggestion });
    }

    return suggestions;
  }

  async handleEcommercePlatformSyncInventoryJob(jobConfiguration: JobConfiguration) {
    const { entityReferenceId, tenantId, config } = jobConfiguration
    const ecommercePlatform = await this.ecommercePlatformService.findOne(entityReferenceId)
    const storeStockAdjustmentSuggestions = await this.getStockAdjustmentForClientStore(tenantId, config.stockAdjustmentModel)

    try {
      if (ecommercePlatform.name === 'shopify') {
        await this.shopifyConnectorService.syncInventory(jobConfiguration.config as ShopifyConfig, storeStockAdjustmentSuggestions)
      }
    }
    catch (e) {
      console.error(e)
      throw (e)
    }

    return true
  }

  async handleWarehouseSyncInventoryJob(jobConfiguration: JobConfiguration) {
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

  async handleSyncInventoryJob(jobConfiguration: JobConfiguration) {
    const { entityType } = jobConfiguration
    try {
      if (entityType === EntityType.warehouseManagemenSystem) {
        await this.handleWarehouseSyncInventoryJob(jobConfiguration)
      }
      if (entityType === EntityType.ecommercePlatform) {
        await this.handleEcommercePlatformSyncInventoryJob(jobConfiguration)
      }
    }

    catch (e) {
      throw (e)
    }

    return true
  }
}
