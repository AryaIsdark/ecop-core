import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyConnectorController } from './shopify-connector.controller';
import { ShopifyConnectorService } from './shopify-connector.service';

describe('ShopifyConnectorController', () => {
  let controller: ShopifyConnectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyConnectorController],
      providers: [ShopifyConnectorService],
    }).compile();

    controller = module.get<ShopifyConnectorController>(ShopifyConnectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
