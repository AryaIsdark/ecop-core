import { Module } from '@nestjs/common';
import { ClientEcommercePlatformService } from './client-ecommerce-platform.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientEcommercePlatform } from './entities/client-ecommerce-platform.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientEcommercePlatform])],
  providers: [ClientEcommercePlatformService],
})
export class ClientEcommercePlatformModule {}
