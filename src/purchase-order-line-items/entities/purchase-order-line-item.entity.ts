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

    // @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.lineItems, {
    //     onDelete: 'CASCADE',
    // })
    // purchaseOrder: PurchaseOrder;

}

export type PurchaseOrderLineItemQueryParams = {
    pageNumber: number;
    pageSize: number;
    purchaseOrderId: number;
    ean: string;
    sku: string;
    brand: string;
    productName: string;
};