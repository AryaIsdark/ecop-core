import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

export type KachingSubscriptionOptions = {
    forcastWindowInDays: number
}

export enum KachingSubscriptionBillingCycleInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

@Entity('kaching_subscription_billing_cycle')
@Unique('uq_subscription_billing_cycle', [
  'contractId',
  'variantId',
  'cycleIndex',
])
export class KachingSubscriptionBillingCycle extends BaseEntity {
  @Column()
  contractId: string;
  
  @Column()
  subscriptionContractStatus: string;

  @Column()
  billingAttemptExpectedDate: Date; // kept as string

  @Column()
  skipped: boolean;

  @Column()
  cycleIndex: number;

  @Column()
  sourceContract_deliveryPolicy_interval: KachingSubscriptionBillingCycleInterval; // kept as string instead of enum

  @Column()
  sourceContract_deliveryPolicy_interval_count: number;

  @Column()
  productId: string;

  @Column()
  variantId: string;
  
  @Column()
  title: string;

  @Column()
  sku: string;

  @Column()
  quantity: number;

  @Column({ nullable: true })
  tenantId: number;
}
