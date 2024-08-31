import { Module } from '@nestjs/common';
import { PowerbodyConnectorService } from './powerbody-connector.service';

@Module({
  providers: [PowerbodyConnectorService],
  exports: [PowerbodyConnectorService]
})
export class PowerbodyConnectorModule {}
