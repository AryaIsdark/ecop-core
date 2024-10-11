import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { JobConfigurationsService } from 'src/job-configurations';
import { JobsService } from 'src/jobs';

@Injectable()
export class CronJobsService {
    constructor(
        private readonly jobConfigurationsService: JobConfigurationsService,
        private readonly jobsService: JobsService,
        private scheduleRegistry: SchedulerRegistry,
    ) {

    }

    async scheduleJobs() {
        console.log('hello from scheduleJobs')
        const jobConfigurations = await this.jobConfigurationsService.findAll()
        for (const jobConfiguration of jobConfigurations) {
            if (jobConfiguration.cronExpression?.length) {
                const cronJob = new CronJob(jobConfiguration.cronExpression, () => {
                    this.jobsService.addNewJobAdhoc(jobConfiguration.id)
                })

                this.scheduleRegistry.addCronJob(`${jobConfiguration.id}`, cronJob)
                cronJob.start()
            }
        }
    }

}
