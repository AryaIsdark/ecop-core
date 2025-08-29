import { Module } from '@nestjs/common';
import { KachingSubscriptionsConnectorService } from './kaching-subscriptions-connector.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KachingSubscriptionBillingCycle } from './entities/kachin-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KachingSubscriptionBillingCycle])],
  providers: [KachingSubscriptionsConnectorService],
  exports: [KachingSubscriptionsConnectorService]
})
export class KachingSubscriptionsConnectorModule {}
