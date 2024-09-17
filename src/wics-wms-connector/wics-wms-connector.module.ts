import { Module } from '@nestjs/common';
import { WicsWmsConnectorService } from './wics-wms-connector.service';

@Module({
  providers: [WicsWmsConnectorService],
  exports: [WicsWmsConnectorService]
})
export class WicsWmsConnectorModule {}
