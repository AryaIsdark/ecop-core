import { Test, TestingModule } from '@nestjs/testing';
import { EcommercePlatformsController } from './ecommerce-platforms.controller';
import { EcommercePlatformsService } from './ecommerce-platforms.service';

describe('EcommercePlatformsController', () => {
  let controller: EcommercePlatformsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EcommercePlatformsController],
      providers: [EcommercePlatformsService],
    }).compile();

    controller = module.get<EcommercePlatformsController>(EcommercePlatformsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
