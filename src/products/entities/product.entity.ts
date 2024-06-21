import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

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

  // @ManyToOne(() => Supplier, (supplier) => supplier.products)
  // supplier: Supplier;

  // @ManyToOne(() => Client, (client) => client.clientProducts)
  // client: Client;
}
