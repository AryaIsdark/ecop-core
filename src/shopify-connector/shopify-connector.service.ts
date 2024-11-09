import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrderStatus } from 'src/orders';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderLine } from 'src/order-lines';
import { getOrdersQuery } from './grqphql/queries/get-orders';
import { runBulkQuery } from './utilities/run-bulk-query';
import { pollBulkOperationStatus } from './utilities/poll-bulk-operation-status';
import { fetchBulkOperationResults } from './utilities/fetch-bulk-operation-results';
import { GET_PRODUCT_VARIANTS_WITH_INVENTORY_INFOR } from './grqphql/queries/get-products-with-inventory-information';
import { InventoryStockSuggestion, ShopStockModel } from 'src/inventory-sync/inventory-sync.service';
import { chunkArray } from 'src/utils/chunk-array/chunk-array';
import { inventorySetQuantities } from './utilities/inventory-set-quantities';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';
import { handleBulkQueryOperation } from './utilities/handle-bulk-query-operation';

export interface ShopifyConfig {

  storeId: string
  accessToken: string
  locationId?: string
  stockAdjustmentModel?: ShopStockModel,
}

const API_VERSION = '2024-04'

@Injectable()
export class ShopifyConnectorService {

  async syncInventory(shopifyConfig: ShopifyConfig, inventoryStockSuggestions: InventoryStockSuggestion[]) {
    const allProducts = await handleBulkQueryOperation(shopifyConfig, GET_PRODUCT_VARIANTS_WITH_INVENTORY_INFOR);
    const quantities = [];

    for (const product of allProducts) {
      const inventoryStockSuggestion = inventoryStockSuggestions.find((suggestion) => normalizeEAN(product.sku) === normalizeEAN(suggestion.product_ean))
      quantities.push({
        inventoryItemId: product.inventoryItem.id,
        locationId: `gid://shopify/Location/${shopifyConfig.locationId}`,
        quantity: inventoryStockSuggestion?.stockSuggestion ?? 0,
        compareQuantity: null
      });
    }

    const chunkedQuantities = chunkArray(quantities, 250);

    for (const chunk of chunkedQuantities) {
      await inventorySetQuantities(shopifyConfig, chunk);
    }
  }

  getAllOrders(orders) {
    const data = []
    const mappedData = []
    for (const order of orders) {
      if (order.id) {
        data.push(order)
      }
    }

    for (const order of data) {
      if (order.id) {
        const allChildrens = orders.filter((o) => o.__parentId === order.id)
        const lineItems = []
        for (const child of allChildrens) {
          if (child.product) {
            lineItems.push(child)
          }
        }
        mappedData.push({ ...order, lineItems })
      }
    }

    return mappedData
  }



  async getBulkOrders(shopifyConfig: ShopifyConfig): Promise<CreateOrderDto[]> {

    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 7);
      const yesterdayISO = yesterday.toISOString();
      const operationId = await runBulkQuery(shopifyConfig, getOrdersQuery(`created_at:>${yesterdayISO}`))
      const resultUrl = await pollBulkOperationStatus(shopifyConfig, operationId);
      const ordersResponse = await fetchBulkOperationResults(resultUrl)
      const shopifyOrders = this.getAllOrders(ordersResponse)
      const orders = []
      for (const shopifyOrder of shopifyOrders) {
        // Using for loop for processing line items
        const lineItems = [];
        const shopifyLineItems = shopifyOrder.lineItems;
        for (const shopifyLineItem of shopifyLineItems) {
          const orderLine = {
            product_sku: shopifyLineItem.sku,
            quantity: shopifyLineItem.quantity,
            status: shopifyOrder.displayFulfillmentStatus === 'FULFILLED' ? OrderStatus.FULLFILED : OrderStatus.CREATED
          };
          lineItems.push(orderLine);
        }
        console.log('status', shopifyOrder.displayFulfillmentStatus)
        const order: CreateOrderDto = {
          reference: shopifyOrder.confirmationNumber,
          originalCreatedAt: shopifyOrder.createdAt,
          totalAmount: shopifyOrder.totalPriceSet?.shopMoney.amount,
          status: shopifyOrder.displayFulfillmentStatus === 'FULFILLED' ? OrderStatus.FULLFILED : OrderStatus.CREATED,
          lineItems: lineItems,
          clientId: 0
        };
        orders.push(order);
      }


      return orders;

    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }


  async getOrders(shopifyConfig: ShopifyConfig): Promise<CreateOrderDto[]> {

    const apiUrl = `https://${shopifyConfig.storeId}.myshopify.com/admin/api/${API_VERSION}/orders.json?status=any`
    const headers = { "X-Shopify-Access-Token": shopifyConfig.accessToken }

    try {
      const response = await axios.get(apiUrl, { headers })
      return response.data.orders.map((shopifyOrder) => {
        const orderLines: Partial<OrderLine[]> = shopifyOrder.line_items.map((shopifyLineItem) => {
          const orderLine: Partial<OrderLine> = {
            product_sku: shopifyLineItem.sku
          }
          return orderLine
        })

        const order: CreateOrderDto = {
          reference: shopifyOrder.confirmation_number,
          totalAmount: shopifyOrder.current_total_price,
          originalCreatedAt: shopifyOrder.created_at,
          status: OrderStatus.CREATED,
          lineItems: orderLines,
          clientId: 0
        }
        return order
      })
    }
    catch (e) {
      throw (e)
    }
  }
}
