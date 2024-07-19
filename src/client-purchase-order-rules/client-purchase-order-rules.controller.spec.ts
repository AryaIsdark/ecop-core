import { Test, TestingModule } from '@nestjs/testing';
import { ClientPurchaseOrderRulesController } from './client-purchase-order-rules.controller';
import { ClientPurchaseOrderRulesService } from './client-purchase-order-rules.service';

describe('ClientPurchaseOrderRulesController', () => {
  let controller: ClientPurchaseOrderRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientPurchaseOrderRulesController],
      providers: [ClientPurchaseOrderRulesService],
    }).compile();

    controller = module.get<ClientPurchaseOrderRulesController>(ClientPurchaseOrderRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
