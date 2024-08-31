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
      redis: {
        host: "redis://red-cio50jl9aq06u3mln3p0",
        port: 6379
      }
    }),
    JobsModule,
    JobConfigurationsModule,
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService]
})
export class QueueModule {}
