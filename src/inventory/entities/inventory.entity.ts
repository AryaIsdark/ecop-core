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
  number_of_items: number;

  @Column({ nullable: true })
  sellable_number_of_items: number;

  @Column({ nullable: true })
  number_of_book_items: number;

  @Column({ nullable: true })
  to_receive_number_of_items: number;

  @Column({ nullable: true })
  adjustment_point: number;

  @Column({ nullable: true })
  stock_limit: number;
  
  @Column({ nullable: true })
  actual_stock: number;

  @Column({ nullable: true })
  reorder_point: number;

  @Column({ nullable: true })
  clientId: number;
}

export type InventoryQueryParams = {
  pageNumber: number, 
  pageSize: number,
  sellable_number_of_items_less_than?: number
  sellable_number_of_items_more_than?: number
  clientId? : number
  product_ean?: string
  product_sku?: string
}