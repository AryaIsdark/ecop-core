export class ExportPurchaseOrderLineItemsParams {
    purchaseOrderId: number;
    separatorCharacter: string;
    exportFormat: string;
    fields: string[]
    fieldsOrder: string[];
    showHeader: boolean
}
