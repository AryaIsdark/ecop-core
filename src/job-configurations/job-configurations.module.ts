import { Module } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConfiguration } from './entities/job-configuration.entity';
@Module({
  imports: [TypeOrmModule.forFeature([JobConfiguration])],
  providers: [JobConfigurationsService],
  exports: [JobConfigurationsService]
})
export class JobConfigurationsModule {}
