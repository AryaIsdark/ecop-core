import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

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

  // @OneToMany(() => Product, (product) => product.client)
  // clientProducts: Product[];

  // @OneToMany(() => WmsOrder, (wmsOrder) => wmsOrder.client)
  // wmsOrders: WmsOrder[];

  // @OneToMany(() => JobConfiguration, (jobConfiguration) => jobConfiguration.client)
  // jobConfigurations: JobConfiguration[];
 
  // @OneToMany(() => Job, (job) => job.client)
  // jobs: Job[];
}
