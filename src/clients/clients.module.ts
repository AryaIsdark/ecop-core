import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { SuppliersModule } from 'src/suppliers/suppliers.module';
import { JobConfigurationsModule } from 'src/job-configurations/job-configurations.module';
import { JobsModule } from 'src/jobs/jobs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), JobsModule, SuppliersModule, JobConfigurationsModule],
  controllers: [ClientsController],
  providers: [ClientsService],
  exports : [ClientsService]
})
export class ClientsModule {}
