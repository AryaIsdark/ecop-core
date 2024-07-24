import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
export class ProductAnalytic extends BaseEntity {

  @Column()
  product_ean: string;
  
  @Column()
  product_sku: string;

  @Column()
  clientId: number;

  @Column()
  orderId: number;

  @Column()
  count: number
}
