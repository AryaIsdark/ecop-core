import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Supplier extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  logo: string;

  // @OneToMany(() => Product, (product) => product.supplier)
  // products: Product[];

}
