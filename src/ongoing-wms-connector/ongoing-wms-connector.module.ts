import { Module } from '@nestjs/common';
import { OngoingWmsConnectorService } from './ongoing-wms-connector.service';

@Module({
  providers: [OngoingWmsConnectorService],
  exports: [OngoingWmsConnectorService]
})
export class OngoingWmsConnectorModule {}
