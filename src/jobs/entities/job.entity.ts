import { BaseEntity } from 'src/base/base-entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export type JobsSearchParams = {
  pageSize? : number, 
  pageNumber? : number,
  tenantId? : number
  entityReferenceId? : number
  status?: JobStatus
}

export enum JobStatus {
    Queued = 'queued',
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
