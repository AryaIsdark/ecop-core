import { Test, TestingModule } from '@nestjs/testing';
import { TestComponentController } from './test-component.controller';
import { TestComponentService } from './test-component.service';

describe('TestComponentController', () => {
  let controller: TestComponentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestComponentController],
      providers: [TestComponentService],
    }).compile();

    controller = module.get<TestComponentController>(TestComponentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
