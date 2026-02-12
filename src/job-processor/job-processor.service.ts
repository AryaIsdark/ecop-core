import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobConfigurationsService } from 'src/job-configurations/job-configurations.service';
import { JobActionType } from 'src/job-configurations/entities/job-configuration.entity';
import { ProductSyncService } from 'src/product-sync/product-sync.service';
import { OrderSyncService } from 'src/order-sync/order-sync.service';
import { InventorySyncService } from 'src/inventory-sync/inventory-sync.service';
import { WebAutomationsService } from 'src/web-automations/web-automations.service';
import { PurchaseOrderSyncService } from 'src/purchase-order-sync/purchase-order-sync.service';
import { Job, JobStatus } from 'src/jobs';
import { ProductAnalyticsService } from 'src/product-analytics';
import axios from 'axios';
import { KachingSubscriptionsConnectorService } from 'src/kaching-subscriptions-connector/kaching-subscriptions-connector.service';

@Injectable()
export class JobProcessorService {
  constructor(
    @InjectRepository(Job)
    private readonly repository: Repository<Job>,
    private readonly jobConfigurationService: JobConfigurationsService,
    private readonly productSyncService: ProductSyncService,
    private readonly purchaseOrderSyncService: PurchaseOrderSyncService,
    private readonly orderSyncService: OrderSyncService,
    private readonly inventorySyncService: InventorySyncService,
    private readonly webAutomationService: WebAutomationsService,
    private readonly productAnalyticsService: ProductAnalyticsService,
    private readonly kachingSubscriptionsConnectorService: KachingSubscriptionsConnectorService,
  ) {}

  async processJob(jobId: number) {
    const currentJob = await this.repository.findOne({ where: { id: jobId } });
    const jobConfiguration = await this.jobConfigurationService.findOne(
      currentJob.entityReferenceId,
    );
    if (!jobConfiguration) {
      // handle not found
      console.log(
        `Unable to find job configuration with id ${currentJob.entityReferenceId}`,
      );
      return `Unable to find job configuration with id ${currentJob.entityReferenceId}`;
    }

    currentJob.status = JobStatus.Processing;
    await this.repository.update(currentJob.id, currentJob);

    try {
      if (jobConfiguration.actionType === JobActionType.MarkTrendingProducts) {
        await this.productAnalyticsService.handleMarkTrendingProducts(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.SyncProductImages) {
        await this.productSyncService.handleSyncProductImagesJob(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.SyncProducts) {
        await this.productSyncService.handleSyncProductJob(jobConfiguration);
      }
      if (jobConfiguration.actionType === JobActionType.SyncInventoryItems) {
        await this.productSyncService.handleSyncStoreProductJob(
          jobConfiguration,
        );
      }
      if (
        jobConfiguration.actionType ===
        JobActionType.SyncKachingSubscriptionBillingCycles
      ) {
        await this.kachingSubscriptionsConnectorService.handleSyncKachingSubscriptionBillingCyclesJob(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.SyncOrders) {
        await this.orderSyncService.handleSyncOrderJob(jobConfiguration);
      }
      if (jobConfiguration.actionType === JobActionType.SyncPurchaseOrders) {
        await this.purchaseOrderSyncService.handleSyncPurchaseOrderJob(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.SyncInventory) {
        await this.inventorySyncService.handleSyncInventoryJob(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.WebAutomation) {
        await this.webAutomationService.handleWebAutomationJob(
          jobConfiguration,
        );
      }
      if (
        jobConfiguration.actionType === JobActionType.AdjustStockMinimumReorder
      ) {
        await this.inventorySyncService.handleAdjustStockMinimumReorder(
          jobConfiguration,
        );
      }
      if (jobConfiguration.actionType === JobActionType.PingService) {
        await this.handlePingWebUrl(jobConfiguration.config.url);
      }

      currentJob.status = JobStatus.Done;
      await this.repository.update(currentJob.id, currentJob);

      return `Succesfully ran job with configuration id ${jobConfiguration.id}`;
    } catch (e) {
      currentJob.status = JobStatus.Failed;
      await this.repository.update(currentJob.id, currentJob);
    }
  }

  async addNewJobAdhoc(jobConfigurationId: number) {
    console.log(`hello from addNewJobAdhoc: I ran for ${jobConfigurationId}`);
    const jobConfiguration =
      await this.jobConfigurationService.findOne(jobConfigurationId);

    if (jobConfiguration?.id) {
      const newJob = new Job();
      newJob.status = JobStatus.Queued;
      newJob.entityReferenceId = jobConfiguration.id;
      newJob.tenantId = jobConfiguration.tenantId;
      const savedJob = await this.repository.save(newJob);
      if (savedJob.id) {
        return await this.processJob(savedJob.id);
      }
    }

    return 'could not find a job configuration with the given ID';
  }

  async addNewJob(entityReferenceId: number, tenantId: number) {
    const newJob = new Job();
    newJob.status = JobStatus.Queued;
    newJob.entityReferenceId = entityReferenceId;
    newJob.tenantId = tenantId;
    return await this.repository.save(newJob);
  }

  async handlePingWebUrl(webUrl: string) {
    try {
      const response = await axios.get(webUrl);
      return response.data;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}
