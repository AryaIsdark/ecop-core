import { Module, DynamicModule, Global, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config/database-config.service';
import { DataSourceOptions } from 'typeorm';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { CronJobsModule } from './cron-jobs/cron-jobs.module'; // Import your CronJobsModule
import { CronJobsService } from './cron-jobs/cron-jobs.service'; // Import CronJobsService
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
  imports: [UserSettingsModule, CronJobsModule], // Include necessary modules
  providers: []
})
export class CoreModule implements OnModuleInit {
  constructor(private readonly cronJobsService: CronJobsService) {}

  static forRoot(dataSourceOptions: DataSourceOptions): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        ScheduleModule.forRoot(), // Initialize the scheduler
        TypeOrmModule.forRoot({
          type: dataSourceOptions['type'],
          synchronize: dataSourceOptions['synchronize'],
          host: dataSourceOptions['host'],
          port: dataSourceOptions['port'],
          username: dataSourceOptions['username'],
          password: dataSourceOptions['password'],
          database: dataSourceOptions['database'],
          entities: dataSourceOptions['entities'],
          migrations: dataSourceOptions['migrations']
        } as DataSourceOptions),
      ],
      controllers: [AppController],
      providers: [AppService, DatabaseConfigService],
      exports: [DatabaseConfigService],
    };
  }

  async onModuleInit() {
    // await this.cronJobsService.scheduleJobs();
  }
}
