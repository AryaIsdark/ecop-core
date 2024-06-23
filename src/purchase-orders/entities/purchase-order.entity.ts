import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

}
