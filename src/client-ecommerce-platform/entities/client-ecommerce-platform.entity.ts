import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/base/base-entity';

@Entity()
export class ClientEcommercePlatform extends BaseEntity {
    @Column()
    clientId: number;

    @Column()
    ecommercePlatformId: number;

    @Column({nullable:true, type: 'jsonb' })
    config: Record<string, any>;
}