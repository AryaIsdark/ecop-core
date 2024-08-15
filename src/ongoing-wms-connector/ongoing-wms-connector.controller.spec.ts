import { Test, TestingModule } from '@nestjs/testing';
import { OngoingWmsConnectorController } from './ongoing-wms-connector.controller';
import { OngoingWmsConnectorService } from './ongoing-wms-connector.service';

describe('OngoingWmsConnectorController', () => {
  let controller: OngoingWmsConnectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OngoingWmsConnectorController],
      providers: [OngoingWmsConnectorService],
    }).compile();

    controller = module.get<OngoingWmsConnectorController>(OngoingWmsConnectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
