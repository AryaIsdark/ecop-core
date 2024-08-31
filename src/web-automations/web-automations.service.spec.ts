import { Test, TestingModule } from '@nestjs/testing';
import { WebAutomationsService } from './web-automations.service';

describe('WebAutomationsService', () => {
  let service: WebAutomationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebAutomationsService],
    }).compile();

    service = module.get<WebAutomationsService>(WebAutomationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
