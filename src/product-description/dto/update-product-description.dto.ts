import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDescriptionDto } from './create-product-description.dto';

export class UpdateProductDescriptionDto extends PartialType(CreateProductDescriptionDto) {}
