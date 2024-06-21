import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { JobConfigurationsService } from 'src/job-configurations/job-configurations.service';
import { JobActionType, JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { JobsService } from 'src/jobs/jobs.service';

export interface SupplierProductSyncJobConfiguration extends JobConfiguration {
  supplier: Supplier
}
@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    private readonly suppliersService: SuppliersService,
    private readonly jobConfigurationsService: JobConfigurationsService,
    private readonly jobsService : JobsService
  ) { }


  async getProductSyncJobConfigurations(clientId: number): Promise<SupplierProductSyncJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.search(clientId, JobActionType.SupplierSyncProducts)
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const supplierId = jobConfiguration.entityReferenceId
      const supplier = await this.suppliersService.findOne(supplierId)
      const jobs = await this.jobsService.search({entityReferenceId : jobConfiguration.id})
      mappedJobConfigurations.push({ ...jobConfiguration, supplier, jobs })
    }

    return mappedJobConfigurations
  }

  async getTenantSupplierOptions(tenantId: number) {
    const supplierOptions = await this.suppliersService.findAll()
    return supplierOptions
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
