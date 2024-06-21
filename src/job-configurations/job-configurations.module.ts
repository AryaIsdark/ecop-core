import { Module } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { JobConfigurationsController } from './job-configurations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConfiguration } from './entities/job-configuration.entity';
@Module({
  imports: [TypeOrmModule.forFeature([JobConfiguration])],
  controllers: [JobConfigurationsController],
  providers: [JobConfigurationsService],
  exports: [JobConfigurationsService]
})
export class JobConfigurationsModule {}
