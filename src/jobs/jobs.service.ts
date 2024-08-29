import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, JobStatus, JobsSearchParams } from './entities/job.entity';
import { Repository } from 'typeorm';
import { JobConfigurationsService } from 'src/job-configurations/job-configurations.service';
import { JobActionType } from 'src/job-configurations/entities/job-configuration.entity';
import { ProductSyncService } from 'src/product-sync/product-sync.service';
import { OrderSyncService } from 'src/order-sync/order-sync.service';
import { InventorySyncService } from 'src/inventory-sync/inventory-sync.service';

@Injectable()
export class JobsService {

  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
    private readonly jobConfigurationService: JobConfigurationsService,
    private readonly productSyncService : ProductSyncService,
    private readonly orderSyncService : OrderSyncService,
    private readonly inventorySyncService : InventorySyncService
  ) {

  }

  async create(createJobDto: CreateJobDto) {
    const jobConfiguration = await this.jobConfigurationService.findOne(createJobDto.jobConfigurationId)
    if (!jobConfiguration) {
      // handle not found
      return `Unable to find job configuration with id ${createJobDto.jobConfigurationId}`
    }

    const job = await this.addNewJob(jobConfiguration.id, jobConfiguration.tenantId)

    try {
      if (jobConfiguration.actionType === JobActionType.SyncProducts) {
        await this.productSyncService.handleSyncProductJob(jobConfiguration)
      }
      if(jobConfiguration.actionType === JobActionType.SyncOrders){
        await this.orderSyncService.handleSyncOrderJob(jobConfiguration)
      } 
      if(jobConfiguration.actionType === JobActionType.SyncInventory){
        await this.inventorySyncService.handleSyncInventoryJob(jobConfiguration)
      } 
      this.updateStatus(job.id, JobStatus.Done)

      return `Succesfully ran job with configuration id ${createJobDto.jobConfigurationId}`
    }
    catch (e) {
      this.updateStatus(job.id, JobStatus.Failed)
    }
  }

  async addNewJob(entityReferenceId: number, tenantId: number) {
    const newJob = new Job()
    newJob.status = JobStatus.Processing;
    newJob.entityReferenceId = entityReferenceId;
    newJob.tenantId = tenantId
    return await this.repository.save(newJob)
  }

  async updateStatus(id: number, newStatus: JobStatus) {
    const syncJob = await this.repository.findOne({ where: { id } })
    if (syncJob.id) {
      syncJob.status = newStatus
      this.repository.update(id, syncJob)
    }
    return syncJob
  }

  async search(searchParams: JobsSearchParams) {
    let whereCondition : Partial<Job> = {}
    if(searchParams.entityReferenceId){
      whereCondition = {...whereCondition, entityReferenceId: searchParams.entityReferenceId}
    }
    if(searchParams.status){
      whereCondition = {...whereCondition, status: searchParams.status}
    }
    if(searchParams.tenantId){
      whereCondition = {...whereCondition, tenantId: searchParams.tenantId}
    }
    const response = await this.repository.find({where : whereCondition, order: {updatedAt : 'desc'}})

    return response
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
