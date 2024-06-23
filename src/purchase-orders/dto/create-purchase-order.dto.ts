export class CreatePurchaseOrderDto {
  reference: string;
//   lineItems: PurchaseOrderLineItemDto[] | null;
  supplierId: number;
  clientId: number;
  autoGenerateLineItems: boolean;
}