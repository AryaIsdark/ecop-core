import { Injectable } from '@nestjs/common';
import { EntityType, JobConfiguration } from 'src/job-configurations';
import { PowerbodyConnectorService, PowerbodyWebAutomationConfig } from 'src/powerbody-connector/powerbody-connector.service';
import { ProductSyncService } from 'src/product-sync';
import { SuppliersService } from 'src/suppliers';

@Injectable()
export class WebAutomationsService {
    constructor(
        private readonly suppliersService: SuppliersService,
        private readonly powerbodyConnectorService: PowerbodyConnectorService,
        private readonly productSyncService: ProductSyncService
    ) {

    }

    async handleSupplierWebAutomationJob(jobConfiguration: JobConfiguration) {
        const { entityReferenceId, tenantId } = jobConfiguration
        const supplier = await this.suppliersService.findOne(entityReferenceId)
        if (supplier.name === 'powerbody') {
            const products = await this.powerbodyConnectorService.handleWebAutomationJob(jobConfiguration.config as unknown as PowerbodyWebAutomationConfig, tenantId)
            await this.productSyncService.handleSyncProducts(tenantId, entityReferenceId, products)
        }
    }

    async handleWebAutomationJob(jobConfiguration: JobConfiguration) {
        const { entityType } = jobConfiguration
        if (entityType === EntityType.supplier) {
            await this.handleSupplierWebAutomationJob(jobConfiguration)
            return 'succesfully handled web automation job'
        }
    }
}
