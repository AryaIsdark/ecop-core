import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column } from 'typeorm';

export enum AppRole {
  ECOP_ADMIN = 'ecop-admin',
  TENANT_ADMIN = 'tenant-admin',
  TENANT_USER = 'tenant-user'
}
@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column()
  clientId: number

  @Column({nullable: true})
  role: AppRole
}
