import { Module, DynamicModule } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bull';
import { QueueProcessor } from './queue.processor';
import { JobsModule } from 'src/jobs/jobs.module';
import { JobConfigurationsModule } from 'src/job-configurations';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JobsModule,
    JobConfigurationsModule,
    ConfigModule // Import the ConfigModule to access environment variables
  ],
  providers: [QueueService, QueueProcessor],
  exports: [QueueService],
})
export class QueueModule {
  static forRootAsync(): DynamicModule {
    return {
      module: QueueModule,
      imports: [
        BullModule.registerQueueAsync({
          name: 'queue',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => ({
            redis: {
              host: configService.get<string>('REDIS_HOST', 'localhost'),
              port: configService.get<number>('REDIS_PORT', 6379),
              username: configService.get<string>('REDIS_USERNAME'),
              password: configService.get<string>('REDIS_PASSWORD'),
              tls: configService.get<boolean>('REDIS_TLS', false) ? {} : undefined, // Conditionally enable TLS
            },
          }),
        }),
      ],
    };
  }
}
