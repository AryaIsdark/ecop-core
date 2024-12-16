import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';
import { JobConfigurationsService } from 'src/job-configurations/job-configurations.service';
import { EntityType, JobConfiguration } from 'src/job-configurations/entities/job-configuration.entity';
import { Supplier } from 'src/suppliers/entities/supplier.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { Order } from 'src/orders';
import { EcommercePlatform, EcommercePlatformsService } from 'src/ecommerce-platforms';
import { WarehouseManagementSystem, WarehouseManagementSystemsService } from 'src/warehouse-management-systems';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';

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
    private readonly jobsService: JobsService,
    private readonly subscriptionsService: SubscriptionsService
  ) { }

  async getClientSuppliers(clientId: number): Promise<Supplier[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, { entityType: EntityType.supplier });
    const clientSuppliers: Supplier[] = [];
    const supplierIds = new Set<number>();
  
    for (const jobConfiguration of jobConfigurations) {
      const supplier = await this.suppliersService.findOne(jobConfiguration.entityReferenceId);
      if (!supplierIds.has(supplier.id)) { 
        supplierIds.add(supplier.id);
        clientSuppliers.push(supplier);
      }
    }
  
    return clientSuppliers;
  }

  async getGeneralJobConfigurations(clientId: number): Promise<JobConfiguration[]> {
     const jobConfigurations =  await this.jobConfigurationsService.query(clientId, { entityType: EntityType.general })
     const mappedJobConfigurations = []
     for (const jobConfiguration of jobConfigurations) {              
       const jobs = await this.jobsService.search_deprecated({ entityReferenceId: jobConfiguration.id })
       mappedJobConfigurations.push({ ...jobConfiguration, jobs })
     }

     return mappedJobConfigurations
  }

  async getSupplierJobConfigurations(clientId: number): Promise<SupplierProductSyncJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, { entityType: EntityType.supplier })
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const supplierId = jobConfiguration.entityReferenceId
      const supplier = await this.suppliersService.findOne(supplierId)
      const jobs = await this.jobsService.search_deprecated({ entityReferenceId: jobConfiguration.id })
      mappedJobConfigurations.push({ ...jobConfiguration, supplier, jobs })
    }

    return mappedJobConfigurations
  }

  async getWarehouseManagementSystemJobConfigurations(clientId: number): Promise<WarehouseManagementSystemJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, { entityType: EntityType.warehouseManagemenSystem })
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const warehouseManagementSystemId = jobConfiguration.entityReferenceId
      const warehouseManagementSystem = await this.warehouseManagementSystemsService.findOne(warehouseManagementSystemId)
      const jobs = await this.jobsService.search_deprecated({ entityReferenceId: jobConfiguration.id })
      mappedJobConfigurations.push({ ...jobConfiguration, warehouseManagementSystem, jobs })
    }

    return mappedJobConfigurations
  }

  async getEcommercePlatofmJobConfigurations(clientId: number): Promise<EcommercePlatformJobConfiguration[]> {
    const jobConfigurations = await this.jobConfigurationsService.query(clientId, { entityType: EntityType.ecommercePlatform })
    const mappedJobConfigurations = []
    for (const jobConfiguration of jobConfigurations) {
      const ecommercePlatformId = jobConfiguration.entityReferenceId
      const ecommercePlatform = await this.ecommercePlatformService.findOne(ecommercePlatformId)
      const jobs = await this.jobsService.search_deprecated({ entityReferenceId: jobConfiguration.id })
      mappedJobConfigurations.push({ ...jobConfiguration, ecommercePlatform, jobs })
    }

    return mappedJobConfigurations
  }

  async getTenantEcommercePlatformOptions(tenantId: number) {
    const ecommercePlatformOptions = await this.ecommercePlatformService.findAll()
    return ecommercePlatformOptions
  }

  async getTenantWmsOptions(tenantId: number) {
    const wmsOptions = await this.warehouseManagementSystemsService.findAll()
    return wmsOptions
  }

  async getTenantSupplierOptions(tenantId: number) {
    const supplierOptions = await this.suppliersService.findAll()
    return supplierOptions
  }

  async getTenantReferenceData(tenantId: number) {
    const tenantSupplierOptions = await this.getTenantSupplierOptions(tenantId)
    const tenantWmsOptions = await this.getTenantWmsOptions(tenantId)
    const tenantEcommercePlatformOptions = await this.getTenantEcommercePlatformOptions(tenantId)

    return { tenantSupplierOptions, tenantEcommercePlatformOptions, tenantWmsOptions }

  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const client = await this.repository.findOne({ where: { id } });
    const subscription = await this.subscriptionsService.findOne(client.subscriptionId)
    return {...client, subscription}
  }
}
