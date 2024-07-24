import { Test, TestingModule } from '@nestjs/testing';
import { ProductAnalyticsService } from './product-analytics.service';

describe('ProductAnalyticsService', () => {
  let service: ProductAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAnalyticsService],
    }).compile();

    service = module.get<ProductAnalyticsService>(ProductAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
