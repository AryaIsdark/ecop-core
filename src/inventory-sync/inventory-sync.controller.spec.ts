import { Test, TestingModule } from '@nestjs/testing';
import { InventorySyncController } from './inventory-sync.controller';
import { InventorySyncService } from './inventory-sync.service';

describe('InventorySyncController', () => {
  let controller: InventorySyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventorySyncController],
      providers: [InventorySyncService],
    }).compile();

    controller = module.get<InventorySyncController>(InventorySyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
