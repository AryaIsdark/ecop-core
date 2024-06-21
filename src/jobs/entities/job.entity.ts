import { BaseEntity } from 'src/base/base-entity';
import { Client } from 'src/clients/entities/client.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

export type JobsSearchParams = {
  tenantId? : number
  entityReferenceId? : number
  status?: JobStatus
}

export enum JobStatus {
    Processing = 'processing',
    Done = 'Done',
    Failed = 'failed'
}

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: JobStatus
 
  @Column()
  entityReferenceId: number
  
  @Column()
  tenantId: number

  // @ManyToOne(() => Client, (client) => client.jobs)
  // client: Client;
}
