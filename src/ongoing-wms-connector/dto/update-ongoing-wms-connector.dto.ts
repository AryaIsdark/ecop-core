import { PartialType } from '@nestjs/mapped-types';
import { CreateOngoingWmsConnectorDto } from './create-ongoing-wms-connector.dto';

export class UpdateOngoingWmsConnectorDto extends PartialType(CreateOngoingWmsConnectorDto) {}
