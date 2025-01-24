import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderLineItem, PurchaseOrderLineItemsQueryParams } from './entities/purchase-order-line-item.entity';
import { Repository } from 'typeorm';
import { ProductTrendingScore, ProductsService } from 'src/products';
import { ExportFormat } from 'src/base/export-format';
import { CsvKeyMapping, exportToCsv } from 'src/utils/export-csv/export-csv';
import { ExportPurchaseOrderLineItemsParams } from './dto/export-purchase-order-line-items.dto';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';

@Injectable()
export class PurchaseOrderLineItemsService {
  constructor(
    @InjectRepository(PurchaseOrderLineItem)
    private readonly repository: Repository<PurchaseOrderLineItem>,
    private readonly productsService: ProductsService
  ) { }


  async isExisting(purchaseOrderId: number, productId: number) {
    const result = await this.repository.findOne({
      where: { purchaseOrderId, productId }
    })

    if (result && result.id) {
      return true
    }

    return false
  }

  async query(params: PurchaseOrderLineItemsQueryParams) {
    let whereConditions: Partial<PurchaseOrderLineItemsQueryParams> = {}
    if (params.product_ean) {
      whereConditions = {
        ...whereConditions, product_ean: params.product_ean
      }
    }

    if (params.clientId) {
      whereConditions = {
        ...whereConditions, clientId: params.clientId
      }
    }

    if (params.purchaseOrderId) {
      whereConditions = {
        ...whereConditions, purchaseOrderId: params.purchaseOrderId
      }
    }

    const data = await this.repository.find({ where: whereConditions })

    return data
  }

  async create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto) {
    const { purchaseOrderId, productId, clientId, quantity, supplierId, product_ean, product_sku } = createPurchaseOrderLineItemDto
    const isExisting = await this.isExisting(purchaseOrderId, productId)

    if (isExisting) {
      return 'item already exists in the PO'
    }

    const product = await this.productsService.findOne(productId)

    const linetItem = new PurchaseOrderLineItem()
    linetItem.clientId = clientId
    linetItem.productId = productId
    linetItem.product_ean = normalizeEAN(product.ean)
    linetItem.product_sku = product.sku
    linetItem.purchaseOrderId = purchaseOrderId
    linetItem.supplierId = supplierId
    linetItem.quantity = quantity

    return await this.repository.save(linetItem)
  }

  async getClientLineItems(clientId: number) {
    return await this.repository.find({ where: { clientId } })
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderLineItem`;
  }

  async update(
    updateDto: UpdatePurchaseOrderLineItemDto,
  ): Promise<PurchaseOrderLineItem | string> {
    try {
      const lineItem = await this.repository.findOne({
        where: { id: updateDto.id },
      });
      if (lineItem?.id) {
        lineItem.quantity = updateDto.quantity;
        const updateLineItem =
          await this.repository.save(lineItem);
        return updateLineItem;
      }
    } catch (e) {
      throw e;
    }

    return `something went wrong while updating line item with id ${updateDto.id}`;
  }


  async getLineItemsForPurchaseOrder(purchaseOrderId: number): Promise<PurchaseOrderLineItem[]> {
    const lineItems = await this.repository.find({ where: { purchaseOrderId }, order: { id: 'ASC' } });
    const mappedLineItems = [];
  
    for (const lineItem of lineItems) {
      const product = await this.productsService.findOne(lineItem.productId);
      mappedLineItems.push({ ...lineItem, product });
    }
  
    // Define the order of ProductTrendingScore for sorting
    const trendingScoreOrder = {
      [ProductTrendingScore.HIGH]: 1,
      [ProductTrendingScore.MID]: 2,
      [ProductTrendingScore.LOW]: 3,
    };
  
    // Sort by trending_score
    return mappedLineItems.sort((a, b) => {
      const scoreA = trendingScoreOrder[a.product.trending_score] || Infinity;
      const scoreB = trendingScoreOrder[b.product.trending_score] || Infinity;
      return scoreA - scoreB;
    });
  }

  async getLineItemsForPurchaseOrder_deprecated(purchaseOrderId: number): Promise<PurchaseOrderLineItem[]> {
    const lineItems = await this.repository.find({ where: { purchaseOrderId }, order: { id: 'ASC' } })
    const mappedLineItems = []
    for (const lineItem of lineItems) {
      const product = await this.productsService.findOne(lineItem.productId)
      mappedLineItems.push({ ...lineItem, product })
    }

    return mappedLineItems
  }

  async remove(id: number) {
    try {
      const item = await this.repository.findOne({ where: { id } })
      if (!item.id) {
        return 'item with given id was not found'
      }

      await this.repository.delete(item.id);
      return {
        status: 200,
        message: `succesfully deleted ${id}`,
      };
    } catch (e) {
      return {
        status: 400,
        message: 'something went wrong',
        error: e,
      };
    }
  }

  getExportFields(fields: string[], fieldsOrder: string[]): CsvKeyMapping<PurchaseOrderLineItem>[] {
    const fieldMapping: Record<string, CsvKeyMapping<PurchaseOrderLineItem>> = {
      name: { field: 'product.name', title: 'Name' },
      ean: { field: 'product.ean', title: 'EAN' },
      quantity: { field: 'quantity', title: 'Quantity' },
      sku: { field: 'product.sku', title: 'SKU' },
    };

    return fieldsOrder
      .filter(field => fields.includes(field)) // Ensure the field is in the fields parameter
      .map(field => fieldMapping[field]) // Map to the corresponding key-value pair
      .filter(Boolean); // Filter out undefined values
  }

  getExportFields_deprecated(fields: string[]): CsvKeyMapping<PurchaseOrderLineItem>[] {
    const keys = []
    if (fields.includes('name')) {
      keys.push({ field: 'product.name', title: 'Name' })
    }
    if (fields.includes('ean')) {
      keys.push({ field: 'product.ean', title: 'EAN' })
    }
    if (fields.includes('quantity')) {
      keys.push({ field: 'quantity', title: 'Quantity' })
    }
    if (fields.includes('sku')) {
      keys.push({ field: 'product.sku', title: 'SKU' })
    }

    return keys
  }

  async export(params: ExportPurchaseOrderLineItemsParams) {
    const { purchaseOrderId, exportFormat, fields, fieldsOrder, showHeader = true } = params
    const lineItems = await this.repository.find({ where: { purchaseOrderId }, order: { id: 'ASC' } })
    const mappedLineItems = []
    for (const lineItem of lineItems) {
      const product = await this.productsService.findOne(lineItem.productId)
      mappedLineItems.push({ ...lineItem, product })
    }

    const purchaseOrderKeys = this.getExportFields(fields, fieldsOrder ?? [])

    if (exportFormat === ExportFormat.CSV) {
      // Handle CSV export (.csv)
      return exportToCsv(mappedLineItems, purchaseOrderKeys, showHeader, 'some file')
    }
    if (exportFormat === ExportFormat.EXCEL) {
      // Handle EXCEL export (.excel)
    }
    if (exportFormat === ExportFormat.TEXT) {
      // Handle TEXT export (.txt)
    }

  }
}
