import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { JobsService } from 'src/jobs/jobs.service';

@Processor('queue')
export class QueueProcessor {
  constructor(
    private readonly jobsService: JobsService
  ) { }

  @Process('run-job')
  async handleRunJob(job: Job<{jobId: number}>) {
    await this.jobsService.processJob(job.data as unknown as number)
  }
}
