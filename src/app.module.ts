import { Module, DynamicModule, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobsModule } from './jobs/jobs.module';
import { JobsService } from './jobs/jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config/database-config.service';
import { JobConfigurationsService } from './job-configurations/job-configurations.service';
import { JobConfigurationsModule } from './job-configurations/job-configurations.module';
import { DataSourceOptions } from 'typeorm';
import { TestComponentModule } from './test-component/test-component.module';
import { JobConfiguration } from './job-configurations';


@Global()
@Module({
  imports: [TestComponentModule]
})

export class CoreModule {
  static forRoot(dataSourceOptions: DataSourceOptions): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        TypeOrmModule.forRoot({
          type: dataSourceOptions['type'] ,
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
      providers: [
        AppService,
        DatabaseConfigService],
      exports: [
        DatabaseConfigService,
      ],
    };
  }
}



