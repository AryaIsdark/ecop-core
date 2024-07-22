import { Test, TestingModule } from '@nestjs/testing';
import { OrderSyncController } from './order-sync.controller';
import { OrderSyncService } from './order-sync.service';

describe('OrderSyncController', () => {
  let controller: OrderSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderSyncController],
      providers: [OrderSyncService],
    }).compile();

    controller = module.get<OrderSyncController>(OrderSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
