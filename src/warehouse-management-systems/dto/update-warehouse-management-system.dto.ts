import { PartialType } from '@nestjs/mapped-types';
import { CreateWarehouseManagementSystemDto } from './create-warehouse-management-system.dto';

export class UpdateWarehouseManagementSystemDto extends PartialType(CreateWarehouseManagementSystemDto) {}
