import { Injectable } from '@nestjs/common';
import { CreateWicsWmsConnectorDto } from './dto/create-wics-wms-connector.dto';
import { UpdateWicsWmsConnectorDto } from './dto/update-wics-wms-connector.dto';
import axios from 'axios';
import { CreatePurchaseOrderDto } from 'src/purchase-orders';


export type WicsWarehouse = {
  announced: number;
  physical: number;
  nettoSalable: number;
  warehouseCode: string;
}


export type WicsAnnouncementPayload = {
  reference: string;
  plannedDate: string;
  supplier: number;
  type: string,
  lines: WicsAnnouncementLineItemPayload[];
};

export type WicsAnnouncementLineItemPayload = {
  itemCode: string;
  quantityExpected: number;
  lotNumber: string;
  bestBeforeDate: string;
};


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

  async healthCheck(config: WicsWmsConfig) {
    let isHealthy = false;
    const apiUrl = `${config.apiBaseUrl}/stock`;
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: config.authorization },
      });

      if (response.data.data) {
        isHealthy = true
      }
    }
    catch (e) {
      console.error('WICS WMS is not currently healthy.')
    }

    return isHealthy
  }

  async createPurchaseOrder(config: WicsWmsConfig, params: CreatePurchaseOrderDto) {
    const apiUrl = `${config.apiBaseUrl}/announcement`

    const lines = params.lineItems.map((lineItem) => ({
      itemCode: lineItem.product_ean,
      quantityExpected: lineItem.quantity,
      lotNumber: "0",
      bestBeforeDate: ""
    }))

    const payload: WicsAnnouncementPayload = {
      reference: params.reference,
      type: 'STD2',
      plannedDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split("T")[0], // current date + 5 days
      supplier: 0,
      lines
    }


    try {
      return await axios.post(apiUrl, payload, { headers: { Authorization: config.authorization } })
    }
    catch (e) {
      console.error(e)
    }

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
    const pageSize = 5000;
    let page = 1;
    let allResults: WicsStock[] = [];
    let hasMoreData = true;
    const requestsWithErrors: { url: string; error: any }[] = [];

    const isHealthy = await this.healthCheck(config)
    if (!isHealthy) {
      throw new Error('WICS WMS API is currently not healthy.');
    }

    while (hasMoreData) {
      const apiUrl = `${config.apiBaseUrl}/stock?pageSize=${pageSize}&page=${page}`;
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: config.authorization },
        });

        const results = response.data?.data || [];

        if (results.length > 0) {
          allResults = allResults.concat(results);
          page++;
        }

        if (results.length < pageSize) {
          hasMoreData = false;
        }

        await this.delay(2000);

      } catch (error) {
        const errorCode = error?.response?.data?.code;

        requestsWithErrors.push({ url: apiUrl, error: error?.response?.data });
        console.error('Error in getArticlesInventory:', {
          url: apiUrl,
          error: error?.response?.data,
        });

        if (errorCode === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }
    }

    if (requestsWithErrors.length > 0) {
      console.warn('Completed with errors:', requestsWithErrors);
    }

    return allResults;
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
