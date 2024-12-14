import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job, JobStatus, JobsSearchParams } from './entities/job.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients';
import { JobConfigurationsService } from 'src/job-configurations';

@Injectable()
export class JobsService {

  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    @Inject(forwardRef(() => JobConfigurationsService))
    private readonly jobConfigurationsService: JobConfigurationsService,
  ) {

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
    let searchQueryResult = []
    let whereCondition: Partial<Job> = {}
    if (searchParams.entityReferenceId) {
      whereCondition = { ...whereCondition, entityReferenceId: searchParams.entityReferenceId }
    }
    if (searchParams.status) {
      whereCondition = { ...whereCondition, status: searchParams.status }
    }
    if (searchParams.tenantId) {
      whereCondition = { ...whereCondition, tenantId: searchParams.tenantId }
    }
    const response = await this.repository.find({ where: whereCondition, order: { updatedAt: 'desc' } })

    for(const job of response){
      const client = await this.clientsService.findOne(job.tenantId)
      const jobConfiguration = await this.jobConfigurationsService.findOne(job.entityReferenceId)
      searchQueryResult.push({...job, client, jobConfiguration})
    }

    return searchQueryResult
  }
}
