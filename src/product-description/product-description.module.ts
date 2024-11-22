import { Module } from '@nestjs/common';
import { ProductDescriptionService } from './product-description.service';
import { ProductDescriptionController } from './product-description.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDescription } from './entities/product-description.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductDescription])],
  controllers: [ProductDescriptionController],
  providers: [ProductDescriptionService],
  exports: [ProductDescriptionService]
})
export class ProductDescriptionModule {}
