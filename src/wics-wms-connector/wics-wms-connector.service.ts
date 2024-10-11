import { Injectable } from '@nestjs/common';
import { CreateWicsWmsConnectorDto } from './dto/create-wics-wms-connector.dto';
import { UpdateWicsWmsConnectorDto } from './dto/update-wics-wms-connector.dto';
import axios from 'axios';


export type WicsWarehouse = {
  announced: number;
  physical: number;
  nettoSalable: number;
  warehouseCode: string;
}

export type WicsStock = {
  itemCode: string;
  itemDescription: string;
  physical: number;
  nettoSalable: number;
  announced: number;
  customerNumber: number;
  warehouses: WicsWarehouse[];
}


export interface WicsWmsConfig {
  apiBaseUrl: string,
  authorization: string
}

@Injectable()
export class WicsWmsConnectorService {


  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getArticlesInventory_old(config: WicsWmsConfig) {
    const apiUrl = `${config.apiBaseUrl}/stock?pageSize=20000`
    try {
      const results = await axios.get(apiUrl, { headers: { Authorization: config.authorization } })
      return results
    }
    catch (e) {
      console.error(e)
    }
  }


  async getArticlesInventory(config: WicsWmsConfig): Promise<WicsStock[]> {
    const pageSize = 250;
    let page = 1;
    let allResults: WicsStock[] = [];
    let hasMoreData = true;
    const requestsWithErrors = []
    let apiUrl = ''


    while (hasMoreData) {
      apiUrl = `${config.apiBaseUrl}/stock?pageSize=${pageSize}&page=${page}`
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: config.authorization },
        });

        const results = response.data?.data;
        if (results.length > 0) {
          allResults = [...allResults, ...results];
          page++;
        }

        if (results.length < pageSize) {
          hasMoreData = false;
          return allResults
        }

        await this.delay(500);

      }
      catch (e) {
        requestsWithErrors.push({ url: apiUrl, error: e?.response?.data })
        console.error('WicsWmsConnectorService.getArticlesInventory', e?.response?.data);
      }
    }
    return allResults
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
