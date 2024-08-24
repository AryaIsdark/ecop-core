import { Module } from '@nestjs/common';
import { EcommercePlatformsService } from './ecommerce-platforms.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcommercePlatform } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([EcommercePlatform])],
  providers: [EcommercePlatformsService],
  exports: [EcommercePlatformsService]
})
export class EcommercePlatformsModule {}
