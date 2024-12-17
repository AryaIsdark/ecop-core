import { Module, forwardRef } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { ClientsModule } from 'src/clients';
import { JobConfigurationsModule } from 'src/job-configurations';

@Module({
  imports: [TypeOrmModule.forFeature([Job]),
  forwardRef(() => ClientsModule),
  ],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule { }
