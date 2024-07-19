import { PartialType } from '@nestjs/mapped-types';
import { CreateClientPurchaseOrderRuleDto } from './create-client-purchase-order-rule.dto';

export class UpdateClientPurchaseOrderRuleDto extends PartialType(CreateClientPurchaseOrderRuleDto) {}
