import { BaseEntity } from 'src/base/base-entity';
import { PurchaseOrderLineItem } from 'src/purchase-order-line-items';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';

export enum OrderStatus {
    CREATED='created',
    CANCELLED='cancelled',
    FULLFILED='fullfiled',
    RETURNED='returned',
    DELIVERED='delivered'
}

@Entity()
@Unique(['reference'])
export class Order extends BaseEntity {

  @Column()
  reference: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: OrderStatus, 
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  totalAmount: string;

  @Column({ nullable: true })
  clientId: number;
}
