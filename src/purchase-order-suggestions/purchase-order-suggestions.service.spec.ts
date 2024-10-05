import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderSuggestionsService } from './purchase-order-suggestions.service';

describe('PurchaseOrderSuggestionsService', () => {
  let service: PurchaseOrderSuggestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseOrderSuggestionsService],
    }).compile();

    service = module.get<PurchaseOrderSuggestionsService>(PurchaseOrderSuggestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
