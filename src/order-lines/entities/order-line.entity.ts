import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';
import { Order } from 'src/orders';

@Entity()
export class OrderLine extends BaseEntity {

    @Column()
    product_ean: string;

    @Column()
    product_sku: string

    @Column()
    quantity: number;

    @Column()
    clientId: number;
   
    @Column()
    orderId: number;
}