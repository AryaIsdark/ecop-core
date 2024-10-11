import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum JobActionType {
  SyncProducts = 'sync-products',
  SyncPurchaseOrders = 'sync-purchase-orders',
  SyncOrders = 'sync-orders',
  SyncInventory = 'sync-inventory',
  SyncCustomers = 'sync-customers',
  WebAutomation = 'web-automation'

}

export enum EntityType {
  supplier = 'supplier',
  warehouseManagemenSystem = 'warehouse-management-system',
  order = 'order',
  ecommercePlatform = 'ecommerce-platform'
}

@Entity()
export class JobConfiguration {
  @PrimaryGeneratedColumn() 
  id: number;

  @Column({nullable:true, type: 'varchar' })
  actionType: JobActionType;

  @Column({nullable:true, type: 'varchar', length: 50 })
  syncType: string;

  @Column()
  entityType: EntityType

  @Column({nullable:true, type: 'jsonb' })
  config: Record<string, any>;
 
  @Column()
  entityReferenceId: number
 
  @Column({nullable: true})
  tenantId: number

}
