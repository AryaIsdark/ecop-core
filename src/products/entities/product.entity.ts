import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';


export enum ProductTrendingScore {
  LOW='low',
  MID='mid',
  HIGH='high'
}
@Entity()
@Unique(['sku','tenantId'])
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({
    type: 'decimal',
    nullable: true,
    precision: 10,
    scale: 2,
    default: 0,
  })
  price: number;

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

  @Column({ nullable: true })
  ean_normalized: string;
 
  @Column({ nullable: true })
  main_image_url: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: ProductTrendingScore, 
    default: ProductTrendingScore.LOW,
  })
  trending_score: ProductTrendingScore;

  @Column({nullable: true})
  expiration_date: string;

  @Column({nullable: true})
  expiration_date_normalized: Date;
}


export type ProductsQueryParams = {
  pageNumber?: number;
  pageSize?: number;
  tenantId?: number;
  supplierId?: number;
  sku?: string;
  name?: string;
  ean?: string;
  ean_normalized? : string;
  brand?: string;
  trending_score?: string;
};