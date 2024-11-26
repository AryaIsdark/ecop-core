import { Module } from '@nestjs/common';
import { ProductDescriptionService } from './product-description.service';
import { ProductDescriptionController } from './product-description.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDescription } from './entities/product-description.entity';
import { ClientsModule } from 'src/clients';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDescription]), ClientsModule, ShopifyConnectorModule ],
  controllers: [ProductDescriptionController],
  providers: [ProductDescriptionService],
  exports: [ProductDescriptionService]
})
export class ProductDescriptionModule {}
