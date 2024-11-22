import { Test, TestingModule } from '@nestjs/testing';
import { ProductDescriptionController } from './product-description.controller';
import { ProductDescriptionService } from './product-description.service';

describe('ProductDescriptionController', () => {
  let controller: ProductDescriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductDescriptionController],
      providers: [ProductDescriptionService],
    }).compile();

    controller = module.get<ProductDescriptionController>(ProductDescriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
