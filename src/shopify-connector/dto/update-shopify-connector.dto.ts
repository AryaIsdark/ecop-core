import { PartialType } from '@nestjs/mapped-types';
import { CreateShopifyConnectorDto } from './create-shopify-connector.dto';

export class UpdateShopifyConnectorDto extends PartialType(CreateShopifyConnectorDto) {}
