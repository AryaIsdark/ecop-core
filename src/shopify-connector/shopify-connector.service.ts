import { Injectable } from '@nestjs/common';
import { CreateShopifyConnectorDto } from './dto/create-shopify-connector.dto';
import { UpdateShopifyConnectorDto } from './dto/update-shopify-connector.dto';
import axios from 'axios';
import { OrderStatus } from 'src/orders';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderLine } from 'src/order-lines';
import { getOrdersQuery } from './grqphql/queries/get-orders';
import { runBulkQuery } from './utilities/run-bulk-query';
import { pollBulkOperationStatus } from './utilities/poll-bulk-operation-status';
import { fetchBulkOperationResults } from './utilities/fetch-bulk-operation-results';

export interface ShopifyConfig {
  storeId: string
  accessToken: string
}

const API_VERSION = '2024-04'

@Injectable()
export class ShopifyConnectorService {
   
  getAllOrders(orders){
    const data = []
    const mappedData = []
    for(const order of orders){
      if(order.id){
        data.push(order)
      }
    }

    for(const order of data){
      if(order.id){
        const allChildrens = orders.filter((o)=> o.__parentId === order.id)
        const lineItems = []
        for(const child of allChildrens){
          if(child.product){
            lineItems.push(child)
          }
        }
        mappedData.push({...order, lineItems})
      }
    }

    return mappedData
  }
  


  async getBulkOrders(shopifyConfig: ShopifyConfig): Promise<CreateOrderDto[]> {

    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayISO = yesterday.toISOString();
      const operationId = await runBulkQuery(shopifyConfig, getOrdersQuery(`created_at:>${yesterdayISO}`))
      const resultUrl = await pollBulkOperationStatus(shopifyConfig, operationId);
      const ordersResponse = await fetchBulkOperationResults(resultUrl)
      const shopifyOrders  = this.getAllOrders(ordersResponse)
      const orders = []
      for (const shopifyOrder of shopifyOrders) {
        // Using for loop for processing line items
        const lineItems = [];
        const shopifyLineItems = shopifyOrder.lineItems;
        for (const shopifyLineItem of shopifyLineItems) {
          const orderLine = {
            product_sku: shopifyLineItem.sku,
            quantity: shopifyLineItem.quantity
          };
          lineItems.push(orderLine);
        }

        const order : CreateOrderDto = {
          reference: shopifyOrder.confirmationNumber,
          originalCreatedAt: shopifyOrder.createdAt,
          totalAmount: shopifyOrder.totalPriceSet?.shopMoney.amount,
          status: OrderStatus.CREATED,
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

  create(createShopifyConnectorDto: CreateShopifyConnectorDto) {
    return 'This action adds a new shopifyConnector';
  }

  findAll() {
    return `This action returns all shopifyConnector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopifyConnector`;
  }

  update(id: number, updateShopifyConnectorDto: UpdateShopifyConnectorDto) {
    return `This action updates a #${id} shopifyConnector`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopifyConnector`;
  }
}
