import { Module, forwardRef } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobConfiguration } from './entities/job-configuration.entity';
import { JobsModule } from 'src/jobs';
import { ClientsModule } from 'src/clients';
@Module({
  imports: [TypeOrmModule.forFeature([JobConfiguration]),
  forwardRef(() => ClientsModule),
  forwardRef(() => JobsModule),
  ],
  providers: [JobConfigurationsService],
  exports: [JobConfigurationsService]
})
export class JobConfigurationsModule { }
