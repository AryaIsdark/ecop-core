import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderLineItemDto } from './dto/create-purchase-order-line-item.dto';
import { UpdatePurchaseOrderLineItemDto } from './dto/update-purchase-order-line-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderLineItem } from './entities/purchase-order-line-item.entity';
import { Repository } from 'typeorm';
import { ProductsService } from 'src/products';

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

  findAll() {
    return `This action returns all purchaseOrderLineItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderLineItem`;
  }

  update(id: number, updatePurchaseOrderLineItemDto: UpdatePurchaseOrderLineItemDto) {
    return `This action updates a #${id} purchaseOrderLineItem`;
  }

  async getLineItemsForPurchaseOrder(purchaseOrderId: number) {
    const lineItems = await this.repository.find({ where: { purchaseOrderId } })
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
}
