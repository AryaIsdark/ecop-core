import { Test, TestingModule } from '@nestjs/testing';
import { OrderLinesController } from './order-lines.controller';
import { OrderLinesService } from './order-lines.service';

describe('OrderLinesController', () => {
  let controller: OrderLinesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderLinesController],
      providers: [OrderLinesService],
    }).compile();

    controller = module.get<OrderLinesController>(OrderLinesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
