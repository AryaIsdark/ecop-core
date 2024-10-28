import { CreatePurchaseOrderLineItemDto } from "src/purchase-order-line-items";

export class CreatePurchaseOrderDto {
  reference: string;
  lineItems: CreatePurchaseOrderLineItemDto[] | null;
  supplierId: number;
  clientId: number;
  original_created_at: Date
}