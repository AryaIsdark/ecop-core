import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { JobConfigurationsService } from 'src/job-configurations/job-configurations.service';
import { EntityType, JobActionType, JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { Order, OrdersService } from 'src/orders';
import { EcommercePlatform, EcommercePlatformsService } from 'src/ecommerce-platforms';
import { WarehouseManagementSystem, WarehouseManagementSystemsService } from 'src/warehouse-management-systems';

export interface SupplierProductSyncJobConfiguration extends JobConfiguration {
  supplier: Supplier
}

export interface EcommercePlatformJobConfiguration extends JobConfiguration {
  ecommercePlatform: EcommercePlatform
}
export interface WarehouseManagementSystemJobConfiguration extends JobConfiguration {
  warehouseManagementSystem: WarehouseManagementSystem
}

export interface OrderSyncJobConfiguration extends JobConfiguration {
  order: Order
}
@Injectable()
export class ClientsService {

  constructor(
    @InjectRepository(Client)
    private readonly repository: Repository<Client>,
    private readonly suppliersService: SuppliersService,
    private readonly ecommercePlatformService: EcommercePlatformsService,
    private readonly jobConfigurationsService: JobConfigurationsService,
    private readonly warehouseManagementSystemsService: WarehouseManagementSystemsService,
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
  
  async getWarehouseManagementSystemJobConfigurations(clientId: number): Promise<EcommercePlatformJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, {entityType: EntityType.wareHouseManagemenSystem})
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const ecommercePlatformId = jobConfiguration.entityReferenceId
      const ecommercePlatform = await this.ecommercePlatformService.findOne(ecommercePlatformId)
      const jobs = await this.jobsService.search({entityReferenceId : jobConfiguration.id})
      mappedJobConfigurations.push({ ...jobConfiguration, ecommercePlatform, jobs })
    }

    return mappedJobConfigurations
  }

  async getEcommercePlatofmJobConfigurations(clientId: number): Promise<EcommercePlatformJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, {entityType: EntityType.ecommercePlatform})
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const warehouseManagementSystemId = jobConfiguration.entityReferenceId
      const warehouseManagementSystem = await this.warehouseManagementSystemsService.findOne(warehouseManagementSystemId)
      const jobs = await this.jobsService.search({entityReferenceId : jobConfiguration.id})
      mappedJobConfigurations.push({ ...jobConfiguration, warehouseManagementSystem, jobs })
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
