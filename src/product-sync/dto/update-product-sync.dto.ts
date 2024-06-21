import { PartialType } from '@nestjs/mapped-types';
import { CreateProductSyncDto } from './create-product-sync.dto';

export class UpdateProductSyncDto extends PartialType(CreateProductSyncDto) {}
