import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsController } from './cron-jobs.controller';
import { JobConfigurationsModule } from 'src/job-configurations';
import { JobProcessorModule } from 'src/job-processor';

@Module({
  imports: [JobConfigurationsModule, JobProcessorModule],
  controllers: [CronJobsController],
  providers: [CronJobsService],
  exports: [CronJobsService]
})
export class CronJobsModule {}
