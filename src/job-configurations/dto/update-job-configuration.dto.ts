import { PartialType } from '@nestjs/mapped-types';
import { CreateJobConfigurationDto } from './create-job-configuration.dto';

export class UpdateJobConfigurationDto extends PartialType(CreateJobConfigurationDto) {}
