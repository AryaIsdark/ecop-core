import { Injectable } from '@nestjs/common';
import { CreateOrderSyncDto } from './dto/create-order-sync.dto';
import { UpdateOrderSyncDto } from './dto/update-order-sync.dto';
import { OrdersService } from 'src/orders';
import { JobConfiguration } from 'src/job-configurations';
import axios from 'axios';
import { ShopifyConfig, ShopifyConnectorService } from 'src/shopify-connector/shopify-connector.service';
import { EcommercePlatformsService } from 'src/ecommerce-platforms';
import { OrderLinesService } from 'src/order-lines';

@Injectable()
export class OrderSyncService {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly orderLinesService: OrderLinesService,
    private readonly shopifyConnectorService: ShopifyConnectorService,
    private readonly ecommercePlatformsService: EcommercePlatformsService) {

  }

  create(createOrderSyncDto: CreateOrderSyncDto) {
    return 'This action adds a new orderSync';
  }

  findAll() {
    return `This action returns all orderSync`;
  }

  findOne(id: number) {
    return `This action returns a #${id} orderSync`;
  }

  update(id: number, updateOrderSyncDto: UpdateOrderSyncDto) {
    return `This action updates a #${id} orderSync`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderSync`;
  }

  async handleSyncShopifyOrders(config: ShopifyConfig, clientId) {
    try {
      const orders = await this.shopifyConnectorService.getOrders(config as ShopifyConfig)
      console.log(orders)
      for (const order of orders) {
        const newOrder = await this.ordersService.create({ ...order, clientId })
        if (newOrder.id) {
          for (const lineItem of order.lineItems) {
            await this.orderLinesService.create({ orderId: newOrder.id, clientId, product_sku: lineItem.product_sku, product_ean: lineItem.product_sku, quantity: 1 })
          }
        }
      }
    }
    catch (e) {
      throw e
    }

  }

  async handleSyncOrderJob(jobConfiguration: JobConfiguration) {
    const { entityReferenceId, config, entityType, tenantId } = jobConfiguration
    const ecommercePlatform = await this.ecommercePlatformsService.findOne(entityReferenceId)

    try {
      if (ecommercePlatform.name === 'shopify') {
        await this.handleSyncShopifyOrders(config as ShopifyConfig, tenantId)
      }
    }
    catch (e) {
      throw (e)
    }

    return true
  }
}
