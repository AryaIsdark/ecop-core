import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column } from 'typeorm';

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
  clientId: number;
}
