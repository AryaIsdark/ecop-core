import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseOrderRulesController } from './purchase-order-rules.controller';
import { PurchaseOrderRulesService } from './purchase-order-rules.service';

describe('PurchaseOrderRulesController', () => {
  let controller: PurchaseOrderRulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchaseOrderRulesController],
      providers: [PurchaseOrderRulesService],
    }).compile();

    controller = module.get<PurchaseOrderRulesController>(PurchaseOrderRulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
