
import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, Unique } from 'typeorm';

@Entity()
@Unique(['product_ean', 'clientId', 'language_code'])
export class ProductDescription extends BaseEntity {

    @Column({ type: 'char', length: 2, name: 'language_code' })
    language_code: string;


    @Column({ type: 'text' })
    description: string;

    @Column()
    product_ean: string;

    @Column()
    clientId: number;
}
