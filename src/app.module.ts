import { Module, DynamicModule, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config/database-config.service';
import { DataSourceOptions } from 'typeorm';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductDescriptionModule } from './product-description/product-description.module';
import { OpenaiModule } from './openai/openai.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ProductMediaModule } from './product-media/product-media.module';

export interface CoreModuleOptions {
  dataSourceOptions: DataSourceOptions;
  envVariables?: Record<string, any>; // Accept additional environment variables
}

@Global()
@Module({
  imports: [UserSettingsModule, ProductDescriptionModule, OpenaiModule, SubscriptionsModule, ProductMediaModule], // Include necessary modules
  providers: [],
})
export class CoreModule {
  static forRoot(options: CoreModuleOptions): DynamicModule {
    const { dataSourceOptions, envVariables } = options;

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
      providers: [
        AppService,
        DatabaseConfigService,
        {
          provide: 'CORE_ENV_VARIABLES', // Register the environment variables
          useValue: envVariables || {},
        },
      ],
      exports: [DatabaseConfigService, 'CORE_ENV_VARIABLES'], // Export the environment variables
    };
  }
}
