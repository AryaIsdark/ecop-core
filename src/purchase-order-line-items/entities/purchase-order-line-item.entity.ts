import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

@Entity()
export class PurchaseOrderLineItem extends BaseEntity {

    @Column()
    productId: number;

    @Column()
    quantity: number;

    @Column()
    clientId: number;

    @Column()
    supplierId: number;
   
    @Column()
    purchaseOrderId: number;

    @Column()
    product_ean: string;

    @Column()
    product_sku: string;

    // @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.lineItems, {
    //     onDelete: 'CASCADE',
    // })
    // purchaseOrder: PurchaseOrder;

}

export type PurchaseOrderLineItemsQueryParams = {
    pageNumber?: number;
    pageSize?: number;
    purchaseOrderId?: number;
    product_ean?: string;
    product_sku?: string;
    brand?: string;
    productName?: string;
    clientId?: number;
};