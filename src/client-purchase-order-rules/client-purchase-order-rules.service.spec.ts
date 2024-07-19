import { Test, TestingModule } from '@nestjs/testing';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';

describe('ClientPurchaseOrderRulesService', () => {
  let service: ClientPurchaseOrderRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientPurchaseOrderRulesService],
    }).compile();

    service = module.get<ClientPurchaseOrderRulesService>(ClientPurchaseOrderRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
