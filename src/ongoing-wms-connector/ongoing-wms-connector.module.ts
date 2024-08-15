import { Module } from '@nestjs/common';
import { OngoingWmsConnectorService } from './ongoing-wms-connector.service';
import { OngoingWmsConnectorController } from './ongoing-wms-connector.controller';

@Module({
  controllers: [OngoingWmsConnectorController],
  providers: [OngoingWmsConnectorService],
  exports: [OngoingWmsConnectorService]
})
export class OngoingWmsConnectorModule {}
