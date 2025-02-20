import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateJobConfigurationDto } from './dto/create-job-configuration.dto';
import { UpdateJobConfigurationDto } from './dto/update-job-configuration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityType, JobActionType, JobConfiguration, JobConfigurationsSearchParams } from './entities/job-configuration.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients';
import { JobsService } from '../jobs/jobs.service';


@Injectable()
export class JobConfigurationsService {
  constructor(
    @InjectRepository(JobConfiguration)
    private readonly repository: Repository<JobConfiguration>,

    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
    @Inject(forwardRef(() => JobsService))
    private readonly jobsService: JobsService
  ) {

  }
  create(createJobConfigurationDto: CreateJobConfigurationDto) {
    return 'This action adds a new jobConfiguration';
  }

  async upsert(createJobConfigurationDto: CreateJobConfigurationDto) {
    const { id, tenantId, entityReferenceId, config, syncType, entityType, actionType, cronExpression } = createJobConfigurationDto;
    try {
      let jobConfiguration;

      if (id) {
        jobConfiguration = await this.repository.findOne({ where: { id } });
      }

      if (!jobConfiguration) {
        jobConfiguration = new JobConfiguration();
        jobConfiguration.tenantId = tenantId;
        jobConfiguration.entityReferenceId = entityReferenceId;
      }

      jobConfiguration.syncType = syncType;
      jobConfiguration.config = JSON.parse(config.toString());
      jobConfiguration.entityType = entityType;
      jobConfiguration.actionType = actionType;
      jobConfiguration.cronExpression = cronExpression;

      await this.repository.save(jobConfiguration);
    } catch (e) {
      console.error(e);
    }
  }


  async upsert_deprecated(createJobConfigurationDto: CreateJobConfigurationDto) {
    const { tenantId, entityReferenceId, config, syncType, entityType, actionType, cronExpression } = createJobConfigurationDto
    try {
      if (tenantId) {
        let jobConfiguration = await this.repository.findOne({
          where: {
            tenantId,
            entityReferenceId,
            entityType,
            actionType
          },
        });

        if (!jobConfiguration) {
          jobConfiguration = new JobConfiguration();
          jobConfiguration.tenantId = tenantId;
          jobConfiguration.entityReferenceId = entityReferenceId;
        }

        jobConfiguration.syncType = syncType;
        jobConfiguration.config = JSON.parse(config.toString());
        jobConfiguration.entityType = entityType
        jobConfiguration.actionType = actionType
        jobConfiguration.cronExpression = cronExpression

        await this.repository.save(jobConfiguration);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async search_deprecated(clientId: number, actionType: JobActionType) {
    const result = await this.repository.find({ where: { actionType, tenantId: clientId } })
    return result
  }

  async query(clientId: number, params: Partial<JobConfiguration>) {
    let whereConditions: Partial<JobConfiguration> = {
      tenantId: clientId
    }

    if (params.entityType) {
      whereConditions = { ...whereConditions, entityType: params.entityType }
    }

    if (params.actionType) {
      whereConditions = { ...whereConditions, actionType: params.actionType }
    }

    const result = await this.repository.find({ where: whereConditions })

    return result
  }

  async getClientJobConfigurations(clientId: number) {
    const result = await this.repository.find({ where: { tenantId: clientId } })
    return result
  }

  async findAll() {
    return await this.repository.find()

  }
  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateJobConfigurationDto: UpdateJobConfigurationDto) {
    return `This action updates a #${id} jobConfiguration`;
  }

  remove(id: number) {
    return `This action removes a #${id} jobConfiguration`;
  }


  async search(searchParams: JobConfigurationsSearchParams) {
    let searchQueryResult = [];
    let whereCondition: Partial<JobConfiguration> = {};

    // Build the where condition
    if (searchParams.entityReferenceId) {
      whereCondition = { ...whereCondition, entityReferenceId: searchParams.entityReferenceId };
    }
    if (searchParams.entityType) {
      whereCondition = { ...whereCondition, entityType: searchParams.entityType };
    }
    if (searchParams.tenantId) {
      whereCondition = { ...whereCondition, tenantId: searchParams.tenantId };
    }

    // Calculate pagination
    const pageSize = searchParams.pageSize || 20; // Default page size
    const pageNumber = searchParams.pageNumber || 1; // Default to first page
    const skip = (pageNumber - 1) * pageSize;

    // Fetch paginated results
    const [response, total] = await this.repository.findAndCount({
      where: whereCondition,
      order: { tenantId: 'desc' },
      take: pageSize,
      skip,
    });

    // Enhance results with additional data
    for (const configuration of response) {
      let entity;
      const client = await this.clientsService.findOne(configuration.tenantId);
      const jobs = await this.jobsService.search({ entityReferenceId: configuration.id, pageSize: 3 })
      const recent_job_runs = jobs.data
      const refData = await this.clientsService.getTenantReferenceData(configuration.tenantId)
      if (configuration.entityType === EntityType.supplier) {
        entity = refData.tenantSupplierOptions.find((s) => s.id === configuration.entityReferenceId)
      }
      if (configuration.entityType === EntityType.ecommercePlatform) {
        entity = refData.tenantEcommercePlatformOptions.find((e) => e.id === configuration.entityReferenceId)
      }
      if (configuration.entityType === EntityType.warehouseManagemenSystem) {
        entity = refData.tenantWmsOptions.find((w) => w.id === configuration.entityReferenceId)
      }
      searchQueryResult.push({ ...configuration, client, recent_job_runs, entity });
    }

    // Return results and pagination metadata
    return {
      data: searchQueryResult,
      total,
      pageSize,
      pageNumber,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
