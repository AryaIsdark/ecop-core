import { BaseEntity } from "src/base/base-entity";
import { Column, Entity } from "typeorm";


@Entity()
export class WarehouseManagementSystem extends BaseEntity {

  @Column()
  name: string
}

