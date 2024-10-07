import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

export enum OrderLineStatus {
    CREATED='created',
    CANCELLED='cancelled',
    FULLFILED='fullfiled',
    RETURNED='returned',
    DELIVERED='delivered'
}

@Entity()
export class OrderLine extends BaseEntity {

    @Column()
    product_ean: string;

    @Column()
    product_sku: string

    @Column()
    quantity: number;

    @Column()
    originalCreatedAt: Date;

    @Column()
    clientId: number;
   
    @Column()
    orderId: number;

    @Column()
    status: OrderLineStatus
}


export type OrderLinesQueryParams = {
    pageNumber?: number;
    pageSize?: number;
    orderId?: number;
    product_ean?: string;
    product_sku?: string;
    brand?: string;
    productName?: string;
    clientId?: number;
};