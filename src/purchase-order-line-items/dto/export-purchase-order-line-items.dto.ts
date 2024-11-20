export class ExportPurchaseOrderLineItemsParams {
    purchaseOrderId: number;
    exportFormat: string;
    fields: string[]
    fieldsOrder: string[];
    showHeader: boolean
}
