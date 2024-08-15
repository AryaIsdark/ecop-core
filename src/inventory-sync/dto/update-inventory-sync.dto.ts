import { PartialType } from '@nestjs/mapped-types';
import { CreateInventorySyncDto } from './create-inventory-sync.dto';

export class UpdateInventorySyncDto extends PartialType(CreateInventorySyncDto) {}
