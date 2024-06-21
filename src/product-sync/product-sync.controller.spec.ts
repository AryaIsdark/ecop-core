import { Test, TestingModule } from '@nestjs/testing';
import { ProductSyncController } from './product-sync.controller';
import { ProductSyncService } from './product-sync.service';

describe('ProductSyncController', () => {
  let controller: ProductSyncController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductSyncController],
      providers: [ProductSyncService],
    }).compile();

    controller = module.get<ProductSyncController>(ProductSyncController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
