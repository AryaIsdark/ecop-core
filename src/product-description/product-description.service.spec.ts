import { Test, TestingModule } from '@nestjs/testing';
import { ProductDescriptionService } from './product-description.service';

describe('ProductDescriptionService', () => {
  let service: ProductDescriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductDescriptionService],
    }).compile();

    service = module.get<ProductDescriptionService>(ProductDescriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
