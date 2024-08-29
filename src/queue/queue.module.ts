import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from './queue.processor';
import { JobsModule } from 'src/jobs/jobs.module';
import { JobConfigurationsModule } from 'src/job-configurations';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
    }),
    JobsModule,
    JobConfigurationsModule,
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService]
})
export class QueueModule {}
