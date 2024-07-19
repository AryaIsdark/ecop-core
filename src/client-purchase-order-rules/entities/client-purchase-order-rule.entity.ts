import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

@Entity()
export class ClientPurchaseOrderRule extends BaseEntity {

    @Column()
    purchaseOrderRuleId: number;

    @Column()
    clientId: number;

    @Column({nullable:true, type: 'jsonb' })
    config: Record<string, any>;
}