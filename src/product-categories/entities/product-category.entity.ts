import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column } from 'typeorm';

@Entity()
export class ProductCategory extends BaseEntity {

    @Column()
    title: string;

    @Column({ unique: true })
    slug: string;

    @Column({ nullable: true })
    description?: string;

    @Column()
    clientId: number;

}
