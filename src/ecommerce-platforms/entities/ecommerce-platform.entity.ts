import { BaseEntity } from "src/base/base-entity";
import { Column, Entity } from "typeorm";


@Entity()
export class EcommercePlatform extends BaseEntity {

  @Column()
  name: string

}
