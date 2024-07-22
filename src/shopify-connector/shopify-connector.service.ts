import { Injectable } from '@nestjs/common';
import { CreateShopifyConnectorDto } from './dto/create-shopify-connector.dto';
import { UpdateShopifyConnectorDto } from './dto/update-shopify-connector.dto';
import axios from 'axios';
import { Order, OrderStatus } from 'src/orders';
import { CreateOrderDto } from 'src/orders/dto/create-order.dto';
import { OrderLine } from 'src/order-lines';

export interface ShopifyConfig {
  storeId: string
  accessToken: string
}

const API_VERSION = '2024-04'

@Injectable()
export class ShopifyConnectorService {

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
