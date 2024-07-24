import { PartialType } from '@nestjs/mapped-types';
import { CreateProductAnalyticDto } from './create-product-analytic.dto';

export class UpdateProductAnalyticDto extends PartialType(CreateProductAnalyticDto) {}
