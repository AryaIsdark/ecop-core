import { PartialType } from '@nestjs/mapped-types';
import { CreatePocQueueModuleDto } from './create-queue-module.dto';

export class UpdatePocQueueModuleDto extends PartialType(CreatePocQueueModuleDto) {}
