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
