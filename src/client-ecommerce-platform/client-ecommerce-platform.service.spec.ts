import { Test, TestingModule } from '@nestjs/testing';
import { ClientEcommercePlatformService } from './client-ecommerce-platform.service';

describe('ClientEcommercePlatformService', () => {
  let service: ClientEcommercePlatformService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientEcommercePlatformService],
    }).compile();

    service = module.get<ClientEcommercePlatformService>(ClientEcommercePlatformService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
