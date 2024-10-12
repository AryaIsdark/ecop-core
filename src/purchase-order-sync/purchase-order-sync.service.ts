import { Injectable } from '@nestjs/common';
import { EntityType, JobConfiguration } from 'src/job-configurations';
import { CreatePurchaseOrderDto, PurchaseOrdersService, UpdatePurchaseOrderDto } from 'src/purchase-orders';
import { CreatePurchaseOrderLineItemDto, PurchaseOrderLineItemsService } from 'src/purchase-order-line-items';
import { OngoingWmsConfig, OngoingWmsConnectorService } from 'src/ongoing-wms-connector/ongoing-wms-connector.service';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';
import { Supplier, SuppliersService } from 'src/suppliers';
import { ProductsService } from 'src/products';

@Injectable()
export class PurchaseOrderSyncService {
  constructor(
    private readonly purchaseOrdersService: PurchaseOrdersService,
    private readonly purchaseOrderLineItemsService: PurchaseOrderLineItemsService,
    private readonly productsService: ProductsService,
    private readonly ongoingWmsConnectorService: OngoingWmsConnectorService,
    private readonly wmsService: WarehouseManagementSystemsService,
    private readonly suppliersService: SuppliersService,
  ) {}

  create(createOrderSyncDto: CreatePurchaseOrderDto) {
    return 'This action adds a new orderSync';
  }

  findAll() {
    return 'This action returns all orderSync';
  }

  findOne(id: number) {
    return `This action returns a #${id} orderSync`;
  }

  update(id: number, updateOrderSyncDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} orderSync`;
  }

  remove(id: number) {
    return `This action removes a #${id} orderSync`;
  }

  private async syncPurchaseOrder(record: any, suppliers: Supplier[], tenantId: number) {
    const supplier = suppliers.find((s) =>
      s.name.toLocaleLowerCase() === record.supplierInfo?.supplierName.toLocaleLowerCase()
    );
    if (!supplier?.id) {
      console.error('Supplier not found, unable to create/update Purchase Order');
      return;
    }

    const purchaseOrder: Partial<CreatePurchaseOrderDto> = {
      clientId: tenantId,
      reference: record.purchaseOrderInfo.purchaseOrderNumber,
      supplierId: supplier.id,
      original_created_at : record.purchaseOrderInfo.createdDate
    };

    const updatedPurchaseOrder = await this.purchaseOrdersService.create(purchaseOrder as CreatePurchaseOrderDto);
    if (!updatedPurchaseOrder?.id) {
      return;
    }

    const supplierProducts = await this.productsService.query({
      supplierId: supplier.id,
      pageNumber: 1,
      pageSize: 50000,
    });

    for (const lineItemRecord of record.purchaseOrderLines ?? []) {
      await this.syncPurchaseOrderLineItem(lineItemRecord, updatedPurchaseOrder.id, supplierProducts.data, tenantId);
    }
  }

  private async syncPurchaseOrderLineItem(lineItemRecord: any, purchaseOrderId: number, supplierProducts: any[], tenantId: number) {
    const product = supplierProducts.find(
      (p) => p.ean_normalized === lineItemRecord.article.articleNumber
    );

    if (!product?.id) {
      console.error(`Product with identifier: ${lineItemRecord.article.articleNumber} not found, unable to create/update line item`);
      return;
    }

    const purchaseOrderLine: Partial<CreatePurchaseOrderLineItemDto> = {
      clientId: tenantId,
      purchaseOrderId,
      productId: product.id,
      product_ean: lineItemRecord.article?.articleNumber ?? 'NOT_AVAILABLE',
      product_sku: lineItemRecord.article?.articleNumber ?? 'NOT_AVAILABLE',
      quantity: lineItemRecord.advisedNumberOfItems,
      supplierId: product.supplierId
    };

    await this.purchaseOrderLineItemsService.create(purchaseOrderLine as CreatePurchaseOrderLineItemDto);
  }

  async handleOngoinWmsSyncPurchaseOrderJob(config: OngoingWmsConfig, tenantId: number) {
    try {
      const suppliers = await this.suppliersService.findAll();
      const response = await this.ongoingWmsConnectorService.getPurchaseOrders(config);

      for (const record of response.data) {
        await this.syncPurchaseOrder(record, suppliers, tenantId);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async handleWarehouseManagementSystemSyncPurchaseOrderJob(jobConfiguration: JobConfiguration) {
    const { entityReferenceId, config, tenantId } = jobConfiguration;
    const ecommercePlatform = await this.wmsService.findOne(entityReferenceId);

    if (ecommercePlatform.name === 'ongoing') {
      await this.handleOngoinWmsSyncPurchaseOrderJob(config as OngoingWmsConfig, tenantId);
    }
  }

  async handleSyncPurchaseOrderJob(jobConfiguration: JobConfiguration) {
    const { entityType } = jobConfiguration;
    if (entityType === EntityType.warehouseManagemenSystem) {
      await this.handleWarehouseManagementSystemSyncPurchaseOrderJob(jobConfiguration);
    }
    return true;
  }
}
