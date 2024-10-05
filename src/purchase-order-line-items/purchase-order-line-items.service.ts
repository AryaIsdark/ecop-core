import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products';
import { ExportFormat } from 'src/base/export-format';
import { CsvKeyMapping, exportToCsv } from 'src/utils/export-csv/export-csv';
import { ExportPurchaseOrderLineItemsParams } from './dto/export-purchase-order-line-items.dto';

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

  async create(createPurchaseOrderLineItemDto: CreatePurchaseOrderLineItemDto) {
    const { purchaseOrderId, productId, clientId, quantity, supplierId } = createPurchaseOrderLineItemDto
    const isExisting = await this.isExisting(purchaseOrderId, productId)

    if (isExisting) {
      return 'item already exists in the PO'
    }

    const linetItem = new PurchaseOrderLineItem()
    linetItem.clientId = clientId
    linetItem.productId = productId
    linetItem.purchaseOrderId = purchaseOrderId
    linetItem.supplierId = supplierId
    linetItem.quantity = quantity

    return await this.repository.save(linetItem)
  }

  async getClientLineItems(clientId: number){
    return await this.repository.find({where: {clientId}})
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
      await this.repository.delete(id);
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

  getExportFields(fields: string[]): CsvKeyMapping<PurchaseOrderLineItem>[]{
    const keys = []
    if(fields.includes('name')){
      keys.push({ field: 'product.name', title: 'Name' })
    }
    if(fields.includes('ean')){
      keys.push({ field: 'product.ean', title: 'EAN' })
    }
    if(fields.includes('quantity')){
     keys.push({ field: 'quantity', title: 'Quantity' })
    }
    if(fields.includes('sku')){
      keys.push({ field: 'product.sku', title: 'SKU' })
    }

    return keys
  }

  async export(params: ExportPurchaseOrderLineItemsParams) {
    const {purchaseOrderId, exportFormat, fields, showHeader = true} = params
    const lineItems = await this.repository.find({ where: { purchaseOrderId }, order: { id: 'ASC' } })
    const mappedLineItems = []
    for(const lineItem of lineItems){
      const product = await this.productsService.findOne(lineItem.productId)
      mappedLineItems.push({ ...lineItem, product })
    }

    const purchaseOrderKeys = this.getExportFields(fields)

    if (exportFormat === ExportFormat.CSV) {
      // Handle CSV export (.csv)
      return exportToCsv(mappedLineItems, purchaseOrderKeys, showHeader,  'some file')
    }
    if (exportFormat === ExportFormat.EXCEL) {
      // Handle EXCEL export (.excel)
    }
    if (exportFormat === ExportFormat.TEXT) {
      // Handle TEXT export (.txt)
    }

  }
}
