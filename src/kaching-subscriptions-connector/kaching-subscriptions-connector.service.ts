import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { JobConfiguration } from 'src/job-configurations';
import { Repository } from 'typeorm';
import { KachingSubscriptionBillingCycle } from './entities/kachin-subscription.entity';
import { KachinSubscriptionApiResponse } from './entities/kaching-subscription-api-response';

@Injectable()
export class KachingSubscriptionsConnectorService {
  constructor(
    @InjectRepository(KachingSubscriptionBillingCycle)
    private readonly repo: Repository<KachingSubscriptionBillingCycle>,
  ) {}

  async fetchData(
    jobConfiguration: JobConfiguration,
  ): Promise<KachinSubscriptionApiResponse[]> {
    const { config } = jobConfiguration;
    const { api_url, access_token } = config;
    const headers =  { 'Content-Type': 'application/json',  Authorization: `Bearer ${access_token}`}

    try {
      const response = await axios.get( api_url, { headers });
      return response.data.result;

    } catch (error) {
      console.error('Failed to fetch external subscriptions:', error.message);
      throw new Error('Failed to fetch external subscriptions');
    }
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
