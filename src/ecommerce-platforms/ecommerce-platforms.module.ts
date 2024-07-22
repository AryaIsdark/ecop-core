import { Module } from '@nestjs/common';
import { EcommercePlatformsService } from './ecommerce-platforms.service';
import { EcommercePlatformsController } from './ecommerce-platforms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EcommercePlatform } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([EcommercePlatform])],
  controllers: [EcommercePlatformsController],
  providers: [EcommercePlatformsService],
  exports: [EcommercePlatformsService]
})
export class EcommercePlatformsModule {}
