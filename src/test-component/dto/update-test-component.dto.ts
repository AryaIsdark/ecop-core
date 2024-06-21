import { PartialType } from '@nestjs/mapped-types';
import { CreateTestComponentDto } from './create-test-component.dto';

export class UpdateTestComponentDto extends PartialType(CreateTestComponentDto) {}
