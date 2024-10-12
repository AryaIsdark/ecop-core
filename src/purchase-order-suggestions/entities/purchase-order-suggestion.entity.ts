import { BaseEntity } from "src/base/base-entity";
import { Column } from "typeorm";

export class PurchaseOrderSuggestion extends BaseEntity {

    @Column()
    product_ean: string;

    @Column()
    product_sku : string

    @Column()
    quantity: number

    @Column()
    clientId: number
}
