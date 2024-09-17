import { PartialType } from '@nestjs/mapped-types';
import { CreateWicsWmsConnectorDto } from './create-wics-wms-connector.dto';

export class UpdateWicsWmsConnectorDto extends PartialType(CreateWicsWmsConnectorDto) {}
