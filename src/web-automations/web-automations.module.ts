import { Module } from '@nestjs/common';
import { SuppliersModule } from 'src/suppliers';
import { WebAutomationsService } from './web-automations.service';
import { PowerbodyConnectorModule } from 'src/powerbody-connector/powerbody-connector.module';

@Module({
    imports: [SuppliersModule, PowerbodyConnectorModule],
    providers: [WebAutomationsService],
    exports: [WebAutomationsService]
})

export class WebAutomationsModule {}
