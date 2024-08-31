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
        host: 'oregon-redis.render.com',
        port: 6379, // Default Redis port
        username: 'red-cr9lcm56l47c73cpmrc0',
        password: '083tX07y8O8XX2a5fNXBBYCV0HAydfTR',
        tls: {}, // Empty object enables SSL/TLS
      },
    }),
    JobsModule,
    JobConfigurationsModule,
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService]
})
export class QueueModule {}
