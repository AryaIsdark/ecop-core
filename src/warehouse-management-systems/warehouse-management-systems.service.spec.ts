import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';

describe('WarehouseManagementSystemsService', () => {
  let service: WarehouseManagementSystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WarehouseManagementSystemsService],
    }).compile();

    service = module.get<WarehouseManagementSystemsService>(WarehouseManagementSystemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
