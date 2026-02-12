import { BaseEntity } from 'src/base/base-entity';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Client } from 'src/clients/entities/client.entity';

@Entity()
export class EcommercePlatform extends BaseEntity {
  @Column()
  name: string;
}
