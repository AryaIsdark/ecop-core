import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyConnectorService } from './shopify-connector.service';

describe('ShopifyConnectorService', () => {
  let service: ShopifyConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopifyConnectorService],
    }).compile();

    service = module.get<ShopifyConnectorService>(ShopifyConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
