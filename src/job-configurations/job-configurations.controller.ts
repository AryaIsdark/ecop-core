import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobConfigurationsService } from './job-configurations.service';
import { CreateJobConfigurationDto } from './dto/create-job-configuration.dto';
import { UpdateJobConfigurationDto } from './dto/update-job-configuration.dto';
import { JobActionType } from './entities/job-configuration.entity';

@Controller('job-configurations')
export class JobConfigurationsController {
  constructor(private readonly jobConfigurationsService: JobConfigurationsService) {}

  @Post()
  upsert(@Body() createJobConfigurationDto: CreateJobConfigurationDto) {
    return this.jobConfigurationsService.upsert(createJobConfigurationDto);
  }


  @Get()
  search(
    @Query('actionType') actionType: JobActionType,
    @Query('clientId') clientId: number 
    ) {
    return this.jobConfigurationsService.search(clientId, actionType);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobConfigurationsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobConfigurationDto: UpdateJobConfigurationDto) {
    return this.jobConfigurationsService.update(+id, updateJobConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobConfigurationsService.remove(+id);
  }
}
