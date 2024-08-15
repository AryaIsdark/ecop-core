import { Test, TestingModule } from '@nestjs/testing';
import { InventorySyncService } from './inventory-sync.service';

describe('InventorySyncService', () => {
  let service: InventorySyncService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InventorySyncService],
    }).compile();

    service = module.get<InventorySyncService>(InventorySyncService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
