import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull'
import { JobsService } from 'src/jobs';
import { JobConfigurationsService } from 'src/job-configurations';
import { JobProcessorService } from 'src/job-processor';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue') private readonly productSyncQueue: Queue,
    private readonly jobConfigurationsService : JobConfigurationsService,
    private readonly jobProcessorService : JobProcessorService 
  ) {}

  async runJob(jobConfigurationId: number){
    const jobConfiguration = await this.jobConfigurationsService.findOne(jobConfigurationId)
    const job = await this.jobProcessorService.addNewJob(jobConfiguration.id, jobConfiguration.tenantId)
    await this.productSyncQueue.add('run-job', job.id)
  }
}
