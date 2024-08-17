import { PurchaseOrderLineItem } from 'src/purchase-order-line-items';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';

@Entity()
@Unique(['sku','tenantId'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  price: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: true })
  ean: string;

  @Column({ nullable: true })
  tenantId: number;
  
  @Column({ nullable: true })
  stock: string;

  @Column({ nullable: true })
  supplierId: number;

  // @OneToMany(() => PurchaseOrderLineItem, (lineItem) => lineItem.product)
  // purchaseOrderLineItems: Promise<PurchaseOrderLineItem[]>;

  // @ManyToOne(() => Supplier, (supplier) => supplier.products)
  // supplier: Supplier;

  // @ManyToOne(() => Client, (client) => client.clientProducts)
  // client: Client;
}


export type ProductsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  tenantId?: number;
  supplierId?: number;
  sku?: string;
  name?: string;
  ean?: string;
  brand?: string;
};