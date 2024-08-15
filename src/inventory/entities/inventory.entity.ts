import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['product_ean','clientId'])
export class Inventory extends BaseEntity {

  @Column()
  product_ean: number;

  @Column()
  product_sku: number;

  @Column()
  article_number: number;

  @Column({ nullable: true })
  sellable_number_of_items: string;

  @Column({ nullable: true })
  clientId: number;
}

