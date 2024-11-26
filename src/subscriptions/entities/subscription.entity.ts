import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum SubscriptionType {
    TRIAL = 'trial',
    BASIC = 'basic',
    PRO = 'pro',
    SUPER = 'super',
    ENTERPRISE = 'enterprise',
}

@Entity()
export class Subscription extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        type: 'enum',
        enum: SubscriptionType,
    })
    type: SubscriptionType
}

