import { Test, TestingModule } from '@nestjs/testing';
import { PowerbodyConnectorService } from './powerbody-connector.service';

describe('PowerbodyConnectorService', () => {
  let service: PowerbodyConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PowerbodyConnectorService],
    }).compile();

    service = module.get<PowerbodyConnectorService>(PowerbodyConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
