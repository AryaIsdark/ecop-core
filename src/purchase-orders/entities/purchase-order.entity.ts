import { BaseEntity } from 'src/base/base-entity';
import { PurchaseOrderLineItem } from 'src/purchase-order-line-items/entities/purchase-order-line-item.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum PurchaseOrderStatus {
    Draft = 'draft',
    Created = 'created',
    Cancelled = 'cancelled',
    WmsNotified = 'wmsNotified',
    WmsArrival = 'wmsArrival',
    WmsInbound = 'wmsInbound',
    WmsDeflection = 'wmsDeflection',
    WmsReceived = 'wmsReceived',
    WMsCancelled = 'wmsCancelled',
  }

@Entity()
export class PurchaseOrder extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  reference: string;

  @Column({
    nullable: true,
    type: 'enum',
    enum: PurchaseOrderStatus, 
    default: PurchaseOrderStatus.Draft,
  })
  status: PurchaseOrderStatus; 

  @Column({ nullable: true })
  supplierId: number;
 
  @Column({ nullable: true })
  clientId: number;

  // @OneToMany(
  //   () => PurchaseOrderLineItem,
  //   (lineItem) => lineItem.purchaseOrder,
  //   { cascade: true },
  // )
  // lineItems: Promise<PurchaseOrderLineItem[]>;

}

export type PurchaseOrderQueryParams = {
    clientId?: number
    status?: PurchaseOrderStatus
}

