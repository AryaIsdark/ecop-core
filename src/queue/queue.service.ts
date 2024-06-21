import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull'

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('queue') private readonly productSyncQueue: Queue,
  ) {}

  async runJob(jobConfigurationId: number){
    await this.productSyncQueue.add('run-job', jobConfigurationId)
  }
}
