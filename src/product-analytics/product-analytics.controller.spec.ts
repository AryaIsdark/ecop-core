import { Test, TestingModule } from '@nestjs/testing';
import { ProductAnalyticsController } from './product-analytics.controller';
import { ProductAnalyticsService } from './product-analytics.service';

describe('ProductAnalyticsController', () => {
  let controller: ProductAnalyticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAnalyticsController],
      providers: [ProductAnalyticsService],
    }).compile();

    controller = module.get<ProductAnalyticsController>(ProductAnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
