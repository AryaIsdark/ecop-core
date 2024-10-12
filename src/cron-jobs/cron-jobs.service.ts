import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { JobConfigurationsService } from 'src/job-configurations';
import { JobsService } from 'src/jobs';

@Injectable()
export class CronJobsService {
    private jobQueue: { id: string, job: () => Promise<void> }[] = [];
    private isProcessing = false;

    constructor(
        private readonly jobConfigurationsService: JobConfigurationsService,
        private readonly jobsService: JobsService,
        private scheduleRegistry: SchedulerRegistry,
    ) {}

    async scheduleJobs() {
        const jobConfigurations = await this.jobConfigurationsService.findAll();

        for (const jobConfiguration of jobConfigurations) {
            if (jobConfiguration.cronExpression?.length) {
                const cronJob = new CronJob(jobConfiguration.cronExpression, () => {
                    this.enqueueJob(jobConfiguration.id.toString(), () => this.jobsService.addNewJobAdhoc(jobConfiguration.id) as unknown  as Promise<void>);
                });

                this.scheduleRegistry.addCronJob(`${jobConfiguration.id}`, cronJob);
                cronJob.start();
            }
        }
    }

    private enqueueJob(id: string, job: () => Promise<void>) {
        this.jobQueue.push({ id, job });
        this.processJobs();
    }

    private async processJobs() {
        if (this.isProcessing || !this.jobQueue.length) {
            return;
        }

        this.isProcessing = true;
        const nextJob = this.jobQueue.shift();

        if (nextJob) {
            try {
                // Run the job
                await nextJob.job();
            } catch (error) {
                console.error(`Error running job ${nextJob.id}:`, error);
            }
        }

        this.isProcessing = false;
        // Process the next job in the queue
        if (this.jobQueue.length) {
            this.processJobs();
        }
    }
}
