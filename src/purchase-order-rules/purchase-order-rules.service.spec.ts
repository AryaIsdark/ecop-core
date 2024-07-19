import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';

describe('PurchaseOrderRulesService', () => {
  let service: PurchaseOrderRulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseOrderRulesService],
    }).compile();

    service = module.get<PurchaseOrderRulesService>(PurchaseOrderRulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
