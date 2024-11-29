
import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, } from 'typeorm';

export enum ProductMediaType {
    IMAGE = 'image',
    VIDEO = 'video'
}


@Entity()
export class ProductMedia extends BaseEntity {

    @Column()
    product_ean: string;

    @Column()
    clientId: number;

    @Column({
        nullable: false,
        type: 'enum',
        enum: ProductMediaType,
    })
    type: ProductMediaType

    @Column()
    thumbnail_url: string

    @Column()
    media_url: string
}
