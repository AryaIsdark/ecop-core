import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { EcommercePlatform } from 'src/ecommerce-platforms/entities/ecommerce-platform.entity';

@Entity()
export class Client extends BaseEntity {
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

  @Column({ nullable: true })
  subscriptionId: number;

  @Column({ nullable: true })
  store_currency: string;
}
