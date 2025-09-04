import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { JobConfiguration } from 'src/job-configurations';
import { Repository } from 'typeorm';
import { KachingSubscriptionBillingCycle } from './entities/kachin-subscription.entity';
import { KachingSubscriptionBillingCyclesApiResponse, KachingSubscriptionContract } from './entities/kaching-subscription-api-response';
import { delay } from '../utils/delay/delay';

@Injectable()
export class KachingSubscriptionsConnectorService {
  constructor(
    @InjectRepository(KachingSubscriptionBillingCycle)
    private readonly repo: Repository<KachingSubscriptionBillingCycle>,
  ) {}


  async healthCheck(jobConfiguration: JobConfiguration) {
    const { config } = jobConfiguration;
    const { api_url, access_token } = config;
    const headers =  { 'Content-Type': 'application/json',  Authorization: `Bearer ${access_token}`}
    let isHealthy = false;
    try {
      const response = await axios.get( api_url, { headers });

      if (response.data) {
        isHealthy = true
      }
    }
    catch (e) {
      console.error('Kaching API is currently not  healthy.')
    }

    return isHealthy
  }

  async fetchData(jobConfiguration: JobConfiguration): Promise<KachingSubscriptionContract[]> {
    const { config } = jobConfiguration;
    const { api_url, access_token } = config;

    let allResults : KachingSubscriptionContract[] = []
    let hasNextPage = true 
    let nextCursor = undefined

    const isHealthy = await this.healthCheck(jobConfiguration)

    if(!isHealthy){
      throw new Error('Kaching API is currently not  healthy.')
    }

    const headers =  { 'Content-Type': 'application/json',  Authorization: `Bearer ${access_token}`}

    while(hasNextPage){
      const nextApiUrl = nextCursor ? `${api_url}?cursor=${nextCursor}` : api_url;
      const response = await axios.get<KachingSubscriptionBillingCyclesApiResponse>(nextApiUrl, { headers });
      allResults = [...allResults, ...response.data.result];
      hasNextPage = response.data.hasNextPage;
      nextCursor = response.data.cursor ?? undefined;
      await delay(2000);
    }

    return allResults
  }

  async handleSyncKachingSubscriptionBillingCyclesJob(jobConfiguration: JobConfiguration) {
    
    const updates: KachingSubscriptionBillingCycle[] = [];
    const productSubscriptions = await this.fetchData(jobConfiguration);

    for (const subscription of productSubscriptions) {
      const contractId = subscription.contractId;
      const status = subscription.subscriptionContractStatus

      if (subscription.subscriptionContractStatus === 'ACTIVE') {
        for (const billingCycle of subscription.upcomingBillingCycles) {
          for (const line of billingCycle.sourceContract.lines.nodes) {
            const normalized = this.normalizeProductSubscription( status, billingCycle, line, contractId, jobConfiguration.tenantId,);
            updates.push(normalized);
          }
        }
      }
    }

    try {
      await this.repo.upsert(updates, ['contractId','variantId','cycleIndex']);
    } catch (e) {
      console.error(e);
    }

    return updates;
  }

  normalizeProductSubscription(
    status: string,
    billingCycle: any,
    line: any,
    contractId: string,
    tenantId?: number,
  ): KachingSubscriptionBillingCycle {

    const record = new KachingSubscriptionBillingCycle();

    // productSubscription.internal_reference_id = line.id;
    record.subscriptionContractStatus = status
    record.contractId = contractId;
    record.billingAttemptExpectedDate = billingCycle.billingAttemptExpectedDate;
    record.cycleIndex = billingCycle.cycleIndex;
    record.skipped = billingCycle.skipped;
    record.sourceContract_deliveryPolicy_interval = billingCycle.sourceContract.deliveryPolicy.interval;
    record.sourceContract_deliveryPolicy_interval_count = billingCycle.sourceContract.deliveryPolicy.intervalCount;
    record.productId = line.productId;
    record.variantId = line.variantId;
    record.sku = line.sku;
    record.title = line.title
    record.quantity = line.quantity;

    if (tenantId) {
      record.tenantId = tenantId;
    }

    return record;
  }
}
