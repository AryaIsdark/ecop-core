import { Injectable } from '@nestjs/common';
import { CreateOngoingWmsConnectorDto } from './dto/create-ongoing-wms-connector.dto';
import { UpdateOngoingWmsConnectorDto } from './dto/update-ongoing-wms-connector.dto';
import axios from 'axios';

export interface OngoingWmsConfig {
  apiBaseUrl: string,
  goodsOwnerId : number,
  authorization: string
}

@Injectable()
export class OngoingWmsConnectorService {

  async getArticlesWithInventoryInfo(config: OngoingWmsConfig) {
    const articles = await this.getArticles(config)
    const articleInventories = await this.getArticlesInventory(config)
    const articlesWithInventoryInfo = []
    for(const article of articles.data){
      const inventory = articleInventories.data.find((item)=> item.articleNumber === article.articleNumber)
      articlesWithInventoryInfo.push({...article, inventory: {...article.inventoryInfo, inventoryPerWarehouse : inventory?.inventoryPerWarehouse }})
    }

    return articlesWithInventoryInfo
  }


  async getArticles(config: OngoingWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/v1/articles?goodsOwnerId=${config.goodsOwnerId}`
    try{
      const results = await axios.get(apiUrl, {headers: {Authorization: config.authorization }})
      return results
    }
    catch(e){
      console.error(e)
    }
  }

  async getArticlesInventory(config: OngoingWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/v1/articles/inventoryPerWarehouse?goodsOwnerId=${config.goodsOwnerId}`
    try{
      const results = await axios.get(apiUrl, {headers: {Authorization: config.authorization }})
      return results
    }
    catch(e){
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
    try{
      const results = await axios.get(apiUrl, {headers: {Authorization: config.authorization }})
      return results
    }
    catch(e){
      console.error(e)
    }
  }

   calculateAdjustmentQuantity(params: {numberOfItems: number, numberOfBookedItems: number, numberOfIncomingItems: number, stockLimit?: number}){
       
      const availableStock = params.numberOfItems + params.numberOfIncomingItems
      const actualStock = availableStock - params.numberOfBookedItems

      return actualStock
   }

   extractTotalAvailableStock(article){
    return  article.inventory.inventoryPerWarehouse.reduce(
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
