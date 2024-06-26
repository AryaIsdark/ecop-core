export class CreatePurchaseOrderLineItemDto {
    purchaseOrderId: number;
    productId: number;
    quantity: number;
    clientId: number;
    supplierId: number;
}
