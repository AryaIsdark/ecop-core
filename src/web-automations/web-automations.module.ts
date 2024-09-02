import { Module } from '@nestjs/common';
import { SuppliersModule } from 'src/suppliers';
import { WebAutomationsService } from './web-automations.service';
import { PowerbodyConnectorModule } from 'src/powerbody-connector/powerbody-connector.module';
import { ProductSyncModule } from 'src/product-sync';

@Module({
    imports: [SuppliersModule, PowerbodyConnectorModule, ProductSyncModule],
    providers: [WebAutomationsService],
    exports: [WebAutomationsService]
})

export class WebAutomationsModule {}
