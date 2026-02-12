import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum JobActionType {
  SyncProducts = 'sync-products',
  SyncPurchaseOrders = 'sync-purchase-orders',
  SyncKachingSubscriptionBillingCycles = 'sync-kaching-subscription-billing-cycles',
  SyncOrders = 'sync-orders',
  SyncInventory = 'sync-inventory',
  SyncCustomers = 'sync-customers',
  WebAutomation = 'web-automation',
  SyncProductImages = 'sync-product-images',
  MarkTrendingProducts = 'mark-trending-products',
  AdjustStockMinimumReorder = 'adjust-stock-minimum-reorder',
  PingService = 'ping-service',
  SyncInventoryItems = 'sync-inventory-items',
}

export enum EntityType {
  general = 'general',
  supplier = 'supplier',
  warehouseManagemenSystem = 'warehouse-management-system',
  order = 'order',
  ecommercePlatform = 'ecommerce-platform',
}

@Entity()
export class JobConfiguration {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar' })
  actionType: JobActionType;

  @Column({ nullable: true, type: 'varchar', length: 50 })
  syncType: string;

  @Column()
  entityType: EntityType;

  @Column({ nullable: true, type: 'jsonb' })
  config: Record<string, any>;

  @Column()
  entityReferenceId: number;

  @Column({ nullable: true })
  tenantId: number;

  @Column({ nullable: true })
  cronExpression: string;

  @Column({ nullable: true })
  description: string;
}

export type JobConfigurationsSearchParams = {
  pageNumber?: number;
  pageSize?: number;
  tenantId?: number;
  entityReferenceId?: number;
  actionType?: JobActionType;
  syncType?: string;
  entityType?: EntityType;
};
