import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseManagementSystemsController } from './warehouse-management-systems.controller';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';

describe('WarehouseManagementSystemsController', () => {
  let controller: WarehouseManagementSystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseManagementSystemsController],
      providers: [WarehouseManagementSystemsService],
    }).compile();

    controller = module.get<WarehouseManagementSystemsController>(WarehouseManagementSystemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
