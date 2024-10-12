import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

export enum UserSettingCategory {
    ExportPurchaseOrder = "export_purchase_oder",
    ExportProduct = "export_product"
}

@Entity()
export class UserSetting extends BaseEntity {

    @Column()
    category: UserSettingCategory;

    @Column()
    key: string;

    @Column('text')
    value: string;

    @Column()
    userId: number

}
