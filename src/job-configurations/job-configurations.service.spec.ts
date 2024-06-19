import { Test, TestingModule } from '@nestjs/testing';
import { JobConfigurationsService } from './job-configurations.service';

describe('JobConfigurationsService', () => {
  let service: JobConfigurationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobConfigurationsService],
    }).compile();

    service = module.get<JobConfigurationsService>(JobConfigurationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
