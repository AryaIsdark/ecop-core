export class CreatePurchaseOrderDto {
  reference: string;
//   lineItems: PurchaseOrderLineItemDto[] | null;
  supplierId: number;
  clientId: number;
  autoGenerateLineItems: boolean;
  original_created_at: Date
}