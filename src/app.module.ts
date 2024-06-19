import { Module, DynamicModule, Global} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { JobsService } from './jobs/jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './database-config/database-config.interface';
import { DatabaseConfigService } from './database-config/database-config.service';
import { JobConfigurationsService } from './job-configurations/job-configurations.service';

@Global()
@Module({})
export class CoreModule {
  static forRoot(config: DatabaseConfig): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        TypeOrmModule.forRoot({
          type: config.type,
          host: config.host,
          port: config.port,
          username: config.username,
          password: config.password,
          database: config.database,
          entities: config.entities,
          synchronize: config.synchronize,
          migrations: config.migrations,
        }),
        JobsModule,
      ],
      controllers: [AppController],
      providers: [AppService, JobsService, JobConfigurationsService, DatabaseConfigService],
      exports: [DatabaseConfigService, JobsService, JobConfigurationsService],
    };
  }
}



