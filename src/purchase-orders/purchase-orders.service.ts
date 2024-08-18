import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers';
import { PurchaseOrderLineItemsService } from 'src/purchase-order-line-items';
import { InventoryService } from 'src/inventory/inventory.service';
import { Product } from 'src/products';
import { OrderLinesService } from 'src/order-lines';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly repository: Repository<PurchaseOrder>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly suppliersService: SuppliersService,
    private readonly orderLinesService: OrderLinesService,
    private readonly purchaseOrderLineItemsService: PurchaseOrderLineItemsService,
    private readonly inventoryService: InventoryService,
  ) {

  }

  async suggestLineItemsForPurchaseOrder(purchaseOrderId) : Promise<Product[]> {
    const suggestions = []
    // Get purchase order by ID
    const purchaseOrder = await this.findOne(purchaseOrderId);
    // Get order lines 
    const orderLines = await this.orderLinesService.findAll()
    const productEANs = new Set()
    // from order lines get product EANs
    for (const orderLine of orderLines) {
      if (!productEANs.has(orderLine.product_ean)) {
        const product = await this.productRepository.findOne({ where: { tenantId: purchaseOrder.clientId, supplierId: purchaseOrder.supplierId, ean: orderLine.product_ean } })
        if (product) {
          const inventory = await this.inventoryService.findWithEan(product.ean)
          // Check the inventory on that product
          if (inventory.sellable_number_of_items <= 0) {
            productEANs.add(orderLine.product_ean)
            // Add to suggestion if stock is too low
            suggestions.push(product)
          }
        }
      }
    }

    return suggestions
  }

  async generateLineItemsFromSuggestion(purchaseOrderId){
    const suggestions = await this.suggestLineItemsForPurchaseOrder(purchaseOrderId)
    const purchaseOrder = await this.findOne(purchaseOrderId);
    if(suggestions.length){
      for(const suggestion of suggestions){
        await this.purchaseOrderLineItemsService.create({
            clientId: purchaseOrder.clientId,
            purchaseOrderId: purchaseOrder.id,
            productId: suggestion.id,
            quantity: 1, // TODO: Make a function to get quantity
            supplierId: purchaseOrder.supplierId
          })
      }
    }
  }

  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder | string> {
    const { supplierId, reference, clientId, } = createDto
    if (createDto.supplierId) {
      const purchaseOrder = new PurchaseOrder();
      purchaseOrder.reference = reference;
      purchaseOrder.supplierId = supplierId;
      purchaseOrder.clientId = clientId;
      purchaseOrder.status = PurchaseOrderStatus.Draft;
      const newPurchaseOrder = await this.repository.save(purchaseOrder);

      return newPurchaseOrder;
    }

    return 'Given supplier does not exist in the system';
  }

  async findAll() {
    const purchaseOrders = await this.repository.find();
    const mappedPurchaseOrders = []
    for(const purchaseOrder of purchaseOrders){
      const supplier = await this.suppliersService.findOne(purchaseOrder.supplierId)
      mappedPurchaseOrders.push({...purchaseOrder, supplier})
    }

    return mappedPurchaseOrders
  }

  async getTotalPrice(id: number) {
    const lineItems = await this.purchaseOrderLineItemsService.getLineItemsForPurchaseOrder(id)
    let purchaseOrderTotalPrice = 0
    if (lineItems.length) {
      for (const lineItem of lineItems) {
        const lineItemTotalPrice = Number(lineItem.product.price) * lineItem.quantity
        purchaseOrderTotalPrice = purchaseOrderTotalPrice + lineItemTotalPrice
      }
    }

    return purchaseOrderTotalPrice
  }

  async getTotalNumberOfLineItems(id) {
    const lineItems = await this.purchaseOrderLineItemsService.getLineItemsForPurchaseOrder(id)
    return lineItems.length
  }

  async getOverview(id: number) {
    const totalNumberOfLineItems = await this.getTotalNumberOfLineItems(id)
    const totalPrice = await this.getTotalPrice(id)
    return { totalNumberOfLineItems, totalPrice }
  }

  async findOne(id: number) {
    const purchaseOrder = await this.repository.findOne({ where: { id } });
    const supplier = await this.suppliersService.findOne(purchaseOrder.supplierId)
    const overview = await this.getOverview(id)

    return { ...purchaseOrder, supplier, overview }
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
