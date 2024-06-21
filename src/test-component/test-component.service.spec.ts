import { Test, TestingModule } from '@nestjs/testing';
import { TestComponentService } from './test-component.service';

describe('TestComponentService', () => {
  let service: TestComponentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TestComponentService],
    }).compile();

    service = module.get<TestComponentService>(TestComponentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
