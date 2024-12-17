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

  async search_deprecated(searchParams: JobsSearchParams) {
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


  async search(searchParams: JobsSearchParams) {
    let searchQueryResult = [];
    let whereCondition: Partial<Job> = {};
  
    // Build the where condition
    if (searchParams.entityReferenceId) {
      whereCondition = { ...whereCondition, entityReferenceId: searchParams.entityReferenceId };
    }
    if (searchParams.status) {
      whereCondition = { ...whereCondition, status: searchParams.status };
    }
    if (searchParams.tenantId) {
      whereCondition = { ...whereCondition, tenantId: searchParams.tenantId };
    }
  
    // Calculate pagination
    const pageSize = searchParams.pageSize || 20; // Default page size
    const pageNumber = searchParams.pageNumber || 1; // Default to first page
    const skip = (pageNumber - 1) * pageSize;
  
    // Fetch paginated results
    const [response, total] = await this.repository.findAndCount({
      where: whereCondition,
      order: { updatedAt: 'desc' },
      take: pageSize,
      skip,
    });
  
    // Enhance results with additional data
    for (const job of response) {
      const client = await this.clientsService.findOne(job.tenantId);
      searchQueryResult.push({ ...job, client });
    }
  
    // Return results and pagination metadata
    return {
      data: searchQueryResult,
      total,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(total / pageSize),
    };
  }
  
  
}
