import { Test, TestingModule } from '@nestjs/testing';
import { JobConfigurationsController } from './job-configurations.controller';
import { JobConfigurationsService } from './job-configurations.service';

describe('JobConfigurationsController', () => {
  let controller: JobConfigurationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobConfigurationsController],
      providers: [JobConfigurationsService],
    }).compile();

    controller = module.get<JobConfigurationsController>(JobConfigurationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
