import { EntityType, JobActionType } from "../entities/job-configuration.entity"

export class CreateJobConfigurationDto {
    id: number
    tenantId: number
    actionType: JobActionType
    entityType: EntityType
    entityReferenceId: number
    syncType: string
    cronExpression: string
    config: Record<string, any>
}
