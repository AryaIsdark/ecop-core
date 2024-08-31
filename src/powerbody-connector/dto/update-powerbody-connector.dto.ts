import { PartialType } from '@nestjs/mapped-types';
import { CreatePowerbodyConnectorDto } from './create-powerbody-connector.dto';

export class UpdatePowerbodyConnectorDto extends PartialType(CreatePowerbodyConnectorDto) {}
