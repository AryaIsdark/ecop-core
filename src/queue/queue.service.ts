import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull'
import { JobsService } from 'src/jobs';
import { JobConfigurationsService } from 'src/job-configurations';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue') private readonly productSyncQueue: Queue,
    private readonly jobConfigurationsService : JobConfigurationsService,
    private readonly jobsService : JobsService 
  ) {}

  async runJob(jobConfigurationId: number){
    const jobConfiguration = await this.jobConfigurationsService.findOne(jobConfigurationId)
    const job = await this.jobsService.addNewJob(jobConfiguration.id, jobConfiguration.tenantId)
    await this.productSyncQueue.add('run-job', job.id)
  }
}
