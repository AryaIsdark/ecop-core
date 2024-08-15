import { Test, TestingModule } from '@nestjs/testing';
import { OngoingWmsConnectorService } from './ongoing-wms-connector.service';

describe('OngoingWmsConnectorService', () => {
  let service: OngoingWmsConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OngoingWmsConnectorService],
    }).compile();

    service = module.get<OngoingWmsConnectorService>(OngoingWmsConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
