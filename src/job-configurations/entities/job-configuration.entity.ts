import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export enum JobActionType {
  SupplierSyncProducts = 'supplier-sync-products',
  WmsSyncProducts = 'wms-sync-product',
  WmsSyncOrders = 'wms-sync-orders',
  SyncOrders = 'sync-orders'
}

export enum EntityType {
  supplier = 'supplier',
  wms = 'wms',
  order = 'order'
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
