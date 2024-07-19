import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

@Entity()
export class PurchaseOrderRule extends BaseEntity {

    @Column()
    name: string;
}