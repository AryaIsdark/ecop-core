import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderSyncService } from './purchase-order-sync.service';

describe('PurchaseOrderSyncService', () => {
  let service: PurchaseOrderSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PurchaseOrderSyncService],
    }).compile();

    service = module.get<PurchaseOrderSyncService>(PurchaseOrderSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
