import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseOrderRuleDto } from './create-purchase-order-rule.dto';

export class UpdatePurchaseOrderRuleDto extends PartialType(CreatePurchaseOrderRuleDto) {}
