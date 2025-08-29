import { Test, TestingModule } from '@nestjs/testing';
import { KachingSubscriptionsConnectorService } from './kaching-subscriptions-connector.service';

describe('KachingSubscriptionsConnectorService', () => {
  let service: KachingSubscriptionsConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KachingSubscriptionsConnectorService],
    }).compile();

    service = module.get<KachingSubscriptionsConnectorService>(KachingSubscriptionsConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
