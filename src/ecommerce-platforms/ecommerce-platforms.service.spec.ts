import { Test, TestingModule } from '@nestjs/testing';
import { EcommercePlatformsService } from './ecommerce-platforms.service';

describe('EcommercePlatformsService', () => {
  let service: EcommercePlatformsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EcommercePlatformsService],
    }).compile();

    service = module.get<EcommercePlatformsService>(EcommercePlatformsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
