import { Injectable } from '@nestjs/common';
import { CreateOngoingWmsConnectorDto } from './dto/create-ongoing-wms-connector.dto';
import { UpdateOngoingWmsConnectorDto } from './dto/update-ongoing-wms-connector.dto';
import axios from 'axios';
import { CreatePurchaseOrderDto } from 'src/purchase-orders';
import { Supplier } from 'src/suppliers';
import { KachingSubscriptionOptions } from 'src/kaching-subscriptions-connector/entities/kachin-subscription.entity';

export interface OngoingWmsConfig {
  apiBaseUrl: string,
  goodsOwnerId: number,
  authorization: string, 
  stockLimitAutomation: {
    analyticsRangeInDays: number,
    leadTimeInDays : number,
    safetyStockInPercentage : number
  }
  kachingSubscriptionOptions?: KachingSubscriptionOptions
}

@Injectable()
export class OngoingWmsConnectorService {

  async updateArticleStockLimit(config: OngoingWmsConfig, articleNumber: string, newStockLimit: number) {
    // This function currently doesn't update stocklimit in ongoing, need to investiage why. 
    // However on the long run we should elimnate using the stock_limit values from the WMS and rely on our system only
    try {
      const apiUrl = `${config.apiBaseUrl}/v1/articles`
      const payload = {
        articleNumber,
        goodsOwnerId: config.goodsOwnerId,
        defaultLocation: { stockLimit: newStockLimit }
      }

      return await axios.put(apiUrl, payload, { headers: { Authorization: config.authorization } })
    }
    catch (e) {
      throw e
    }
  }

  async getArticlesWithInventoryInfo(config: OngoingWmsConfig) {
    const articles = await this.getArticles(config)
    const articleInventories = await this.getArticlesInventory(config)
    const articlesWithInventoryInfo = []
    for (const article of articles.data) {
      const inventory = articleInventories.data.find((item) => item.articleNumber === article.articleNumber)
      articlesWithInventoryInfo.push({ ...article, inventory: { ...article.inventoryInfo, inventoryPerWarehouse: inventory?.inventoryPerWarehouse } })
    }

    return articlesWithInventoryInfo
  }

  async createPurchaseOrder(config: OngoingWmsConfig, params: CreatePurchaseOrderDto, supplier: Supplier) {

    const lines = params.lineItems.map((lineItem) => ({
      rowNumber: lineItem.productId,
      articleNumber: lineItem.product_ean,
      numberOfItems: lineItem.quantity,
    }));

    const wmsPurchaseOrder = {
      goodsOwnerId: config.goodsOwnerId,
      purchaseOrderNumber: params.reference,
      supplierInfo: {
        supplierName: supplier.name,
        supplierAddress: {
          name: supplier.name,
          address: ' ',
          postCode: ' ',
          city: ' ',
          telePhone: ' ',
          remark: ' ',
          email: ' ',
          mobilePhone: ' ',
          countryStateCode: ' ',
          countryCode: '',
        },
      },
      purchaseOrderLines: lines,
    };

    try {
      const response = await axios.put(
        `${config.apiBaseUrl}/v1/purchaseOrders`,
        wmsPurchaseOrder,
        { headers: { Authorization: config.authorization } },
      );
      if (response) {
        return {
          message: 'Pruchase order created in wms',
          data: response,
        };
      }
    } catch (e) {
      console.error(e);
    }
  }


  async getArticles(config: OngoingWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/v1/articles?goodsOwnerId=${config.goodsOwnerId}`
    try {
      const results = await axios.get(apiUrl, { headers: { Authorization: config.authorization } })
      return results
    }
    catch (e) {
      console.error(e)
    }
  }

  async getArticlesInventory(config: OngoingWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/v1/articles/inventoryPerWarehouse?goodsOwnerId=${config.goodsOwnerId}`
    try {
      const results = await axios.get(apiUrl, { headers: { Authorization: config.authorization } })
      return results
    }
    catch (e) {
      console.error(e)
    }
  }

  async getPurchaseOrders(config: OngoingWmsConfig) {
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30);

    // Format lastMonth to yyyy-mm-dd
    const formattedLastMonth = lastMonth.toISOString().split('T')[0];
    const apiUrl = `${config.apiBaseUrl}/v1/purchaseOrders?goodsOwnerId=${config.goodsOwnerId}&purchaseOrderStatusChangedTimeFrom=${formattedLastMonth}`
    try {
      const results = await axios.get(apiUrl, { headers: { Authorization: config.authorization } })
      return results
    }
    catch (e) {
      console.error(e)
    }
  }

  calculateAdjustmentQuantity(params: { numberOfItems: number, numberOfBookedItems: number, numberOfIncomingItems: number, stockLimit?: number }) {

    const availableStock = params.numberOfItems + params.numberOfIncomingItems
    const actualStock = availableStock - params.numberOfBookedItems

    return actualStock
  }

  extractTotalAvailableStock(article) {
    return article.inventory.inventoryPerWarehouse.reduce(
      (sum, warehouseInfo) => sum + warehouseInfo.numberOfItems, 0
    );
  }

  create(createOngoingWmsConnectorDto: CreateOngoingWmsConnectorDto) {
    return 'This action adds a new ongoingWmsConnector';
  }

  findAll() {
    return `This action returns all ongoingWmsConnector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ongoingWmsConnector`;
  }

  update(id: number, updateOngoingWmsConnectorDto: UpdateOngoingWmsConnectorDto) {
    return `This action updates a #${id} ongoingWmsConnector`;
  }

  remove(id: number) {
    return `This action removes a #${id} ongoingWmsConnector`;
  }
}
