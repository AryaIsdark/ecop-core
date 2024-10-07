import { BaseEntity } from 'src/base/base-entity';
import { OrderLine } from 'src/order-lines';
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

  @Column()
  originalCreatedAt: Date

  @Column({ nullable: true })
  clientId: number;

}



export type OrdersQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  clientId?: number;
  reference?: string;
  status?: OrderStatus;

};