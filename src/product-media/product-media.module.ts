import { Module } from '@nestjs/common';
import { ProductMediaService } from './product-media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMedia } from './entities/product-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductMedia])],
  controllers: [],
  providers: [ProductMediaService],
  exports: [ProductMediaService]
})
export class ProductMediaModule {}
