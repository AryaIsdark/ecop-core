import { Module, DynamicModule, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from './database-config/database-config.service';
import { DataSourceOptions } from 'typeorm';
import { TestComponentModule } from './test-component/test-component.module';
import { ShopifyConnectorModule } from './shopify-connector/shopify-connector.module';
import { EcommercePlatformsModule } from './ecommerce-platforms/ecommerce-platforms.module';
import { ProductAnalyticsModule } from './product-analytics/product-analytics.module';

@Global()
@Module({
  imports: [TestComponentModule, ShopifyConnectorModule, EcommercePlatformsModule, ProductAnalyticsModule]
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



