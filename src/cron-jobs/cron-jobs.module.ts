import { Module } from '@nestjs/common';
import { CronJobsService } from './cron-jobs.service';
import { CronJobsController } from './cron-jobs.controller';
import { JobConfigurationsModule } from 'src/job-configurations';
import { JobsModule } from 'src/jobs';

@Module({
  imports: [JobConfigurationsModule, JobsModule],
  controllers: [CronJobsController],
  providers: [CronJobsService],
  exports: [CronJobsService]
})
export class CronJobsModule {}
