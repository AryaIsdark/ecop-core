import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from './queue.processor';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'queue',
    }),
    JobsModule,
  ],
  controllers: [QueueController],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService]
})
export class QueueModule {}
