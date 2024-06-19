import { EntityType, JobActionType } from "../entities/job-configuration.entity"

export class CreateJobConfigurationDto {
    tenantId: number
    actionType: JobActionType
    entityType: EntityType
    entityReferenceId: number
    syncType: string
    config: Record<string, any>
}
