import { Injectable } from '@nestjs/common';
import { CreateJobConfigurationDto } from './dto/create-job-configuration.dto';
import { UpdateJobConfigurationDto } from './dto/update-job-configuration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobActionType, JobConfiguration } from './entities/job-configuration.entity';
import { Repository } from 'typeorm';


@Injectable()
export class JobConfigurationsService {
  constructor(
    @InjectRepository(JobConfiguration)
    private readonly repository: Repository<JobConfiguration>,

  ) {

  }
  create(createJobConfigurationDto: CreateJobConfigurationDto) {
    return 'This action adds a new jobConfiguration';
  }

  async upsert(createJobConfigurationDto: CreateJobConfigurationDto) {
    const { tenantId, entityReferenceId, config, syncType, entityType, actionType } = createJobConfigurationDto
    try {
      if (tenantId) {
        let jobConfiguration = await this.repository.findOne({
          where: {
            tenantId,
            entityReferenceId,
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

        await this.repository.save(jobConfiguration);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async search(clientId: number, actionType: JobActionType) {
    const result = await this.repository.find({ where: { actionType, tenantId: clientId } })
    return result
  }

  async query(clientId: number, params: Partial<JobConfiguration>){
    let whereConditions : Partial<JobConfiguration> = {
      tenantId: clientId
    }

    if(params.entityType){
      whereConditions = {...whereConditions, entityType: params.entityType}
    }

    if(params.actionType){
      whereConditions = {...whereConditions, actionType: params.actionType}
    }

    const result = await this.repository.find({where: whereConditions})

    return result
  }

  async getClientJobConfigurations(clientId: number){
    const result = await this.repository.find({ where: { tenantId: clientId } })
    return result
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
}
