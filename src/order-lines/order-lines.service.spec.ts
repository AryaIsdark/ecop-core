import { Test, TestingModule } from '@nestjs/testing';
import { OrderLinesService } from './order-lines.service';

describe('OrderLinesService', () => {
  let service: OrderLinesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderLinesService],
    }).compile();

    service = module.get<OrderLinesService>(OrderLinesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
