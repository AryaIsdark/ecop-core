import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { JobProcessorService } from 'src/job-processor';
import { JobsService } from 'src/jobs/jobs.service';

@Processor('queue')
export class QueueProcessor {
  constructor(
    private readonly jobProcessorService: JobProcessorService
  ) { }

  @Process('run-job')
  async handleRunJob(job: Job<{jobId: number}>) {
    await this.jobProcessorService.processJob(job.data as unknown as number)
  }
}
