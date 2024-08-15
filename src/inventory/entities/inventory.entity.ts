import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['product_ean','clientId'])
export class Inventory extends BaseEntity {

  @Column()
  product_ean: string;

  @Column()
  product_sku: string;

  @Column()
  article_number: string;

  @Column({ nullable: true })
  sellable_number_of_items: number;

  @Column({ nullable: true })
  clientId: number;
}

