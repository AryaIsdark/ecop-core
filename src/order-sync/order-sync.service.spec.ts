import { Test, TestingModule } from '@nestjs/testing';
import { OrderSyncService } from './order-sync.service';

describe('OrderSyncService', () => {
  let service: OrderSyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderSyncService],
    }).compile();

    service = module.get<OrderSyncService>(OrderSyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
