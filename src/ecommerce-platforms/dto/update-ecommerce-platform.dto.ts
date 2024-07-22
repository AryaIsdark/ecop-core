import { PartialType } from '@nestjs/mapped-types';
import { CreateEcommercePlatformDto } from './create-ecommerce-platform.dto';

export class UpdateEcommercePlatformDto extends PartialType(CreateEcommercePlatformDto) {}
