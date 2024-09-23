import { Injectable } from '@nestjs/common';
import { CreateWicsWmsConnectorDto } from './dto/create-wics-wms-connector.dto';
import { UpdateWicsWmsConnectorDto } from './dto/update-wics-wms-connector.dto';
import axios from 'axios';


export interface WicsWmsConfig {
  apiBaseUrl: string,
  authorization: string
}

@Injectable()
export class WicsWmsConnectorService {

  async getArticlesInventory(config: WicsWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/stock`
    try{
      const results = await axios.get(apiUrl, {headers: {Authorization: config.authorization }})
      return results
    }
    catch(e){
      console.error(e)
    }
  }

  create(createWicsWmsConnectorDto: CreateWicsWmsConnectorDto) {
    return 'This action adds a new wicsWmsConnector';
  }

  findAll() {
    return `This action returns all wicsWmsConnector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wicsWmsConnector`;
  }

  update(id: number, updateWicsWmsConnectorDto: UpdateWicsWmsConnectorDto) {
    return `This action updates a #${id} wicsWmsConnector`;
  }

  remove(id: number) {
    return `This action removes a #${id} wicsWmsConnector`;
  }
}
