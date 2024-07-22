import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderSyncDto } from './create-order-sync.dto';

export class UpdateOrderSyncDto extends PartialType(CreateOrderSyncDto) {}
