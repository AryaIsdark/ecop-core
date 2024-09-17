import { Test, TestingModule } from '@nestjs/testing';
import { WicsWmsConnectorService } from './wics-wms-connector.service';

describe('WicsWmsConnectorService', () => {
  let service: WicsWmsConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WicsWmsConnectorService],
    }).compile();

    service = module.get<WicsWmsConnectorService>(WicsWmsConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
