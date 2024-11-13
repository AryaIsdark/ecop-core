import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder, PurchaseOrderQueryParams, PurchaseOrderStatus } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers';
import { PurchaseOrderLineItemsService } from 'src/purchase-order-line-items';
import { InventoryService } from 'src/inventory/inventory.service';
import { Product } from 'src/products';
import { OrderLinesService } from 'src/order-lines';
import { PurchaseOrderSuggestionsService } from 'src/purchase-order-suggestions';
import { ClientsService, WarehouseManagementSystemJobConfiguration } from 'src/clients';
import { WarehouseManagementSystemsService } from 'src/warehouse-management-systems';

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
    private readonly purchaseOrderSuggestionService: PurchaseOrderSuggestionsService,
    private readonly inventoryService: InventoryService,
    private readonly wmsService : WarehouseManagementSystemsService,
    @Inject(forwardRef(() => ClientsService))
    private readonly clientsService: ClientsService,
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
          const inventory = await this.inventoryService.findWithEan(product.ean, product.tenantId)
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
    const purchaseOrder = await this.findOne(purchaseOrderId);
    const suggestions = await this.purchaseOrderSuggestionService.suggestPurchaseOrders(purchaseOrder.clientId, purchaseOrder.supplierId)

    // const suggestions = await this.suggestLineItemsForPurchaseOrder(purchaseOrderId)
    // const purchaseOrder = await this.findOne(purchaseOrderId);
    if(suggestions.length){
      for(const suggestion of suggestions){
        await this.purchaseOrderLineItemsService.create({
            clientId: purchaseOrder.clientId,
            purchaseOrderId: purchaseOrder.id,
            productId: suggestion.id,
            quantity: suggestion.quantity,
            supplierId: purchaseOrder.supplierId,
            product_ean: suggestion.product_ean,
            product_sku: suggestion.product_sku
          })
      }
    }
  }

  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder | null> {
    const { supplierId, reference, clientId, original_created_at } = createDto
    if (createDto.supplierId) {
      const purchaseOrder = new PurchaseOrder();
      purchaseOrder.reference = reference;
      purchaseOrder.supplierId = supplierId;
      purchaseOrder.clientId = clientId;
      purchaseOrder.status = PurchaseOrderStatus.Draft;
      purchaseOrder.original_created_at = original_created_at;
      const newPurchaseOrder = await this.repository.save(purchaseOrder);

      return newPurchaseOrder;
    }

    return  null;
  }



  async publish(id: number, publishDto: CreatePurchaseOrderDto) {
    const purchaseOrder = await this.repository.findOne({ where: { id } })
    const PurchaseOrderLineItems = await this.purchaseOrderLineItemsService.getLineItemsForPurchaseOrder(purchaseOrder.id)
    const payload: CreatePurchaseOrderDto = {
      ...publishDto,
      lineItems: PurchaseOrderLineItems,
    }
    const jobConfiguration : WarehouseManagementSystemJobConfiguration[] = await this.clientsService.getWarehouseManagementSystemJobConfigurations(purchaseOrder.clientId)
    const correspondingWMS = jobConfiguration[0].warehouseManagementSystem
    const config = jobConfiguration[0].config

    try {
      const response = await this.wmsService.publishPurchaseOrder(correspondingWMS, config as unknown as any, payload)
      if (response) {
        return await this.update(purchaseOrder.id, { status: PurchaseOrderStatus.Published, reference: payload.reference  })
      }
    }
    catch (e) {
      console.error(e)
    }

  }

  async update(id: number, payload: Partial<PurchaseOrder>) {
    const purchaseOrder = await this.repository.findOne({ where: { id } })
    if (!purchaseOrder.id) {
      throw new NotFoundException(`purchase order not found with id: ${id}`)
    }

    return await this.repository.update(purchaseOrder.id, payload)
  }


  async findAll() {
    const purchaseOrders = await this.repository.find({order: {createdAt: 'DESC'}});
    const mappedPurchaseOrders = []
    for(const purchaseOrder of purchaseOrders){
      const supplier = await this.suppliersService.findOne(purchaseOrder.supplierId)
      mappedPurchaseOrders.push({...purchaseOrder, supplier})
    }

    return mappedPurchaseOrders
  }

  async getClientPurchaseOrders(clientId: number){  
    return await this.repository.find({where: {clientId}})
  }

  async getTotalPrice(id: number) {
    const lineItems = await this.purchaseOrderLineItemsService.getLineItemsForPurchaseOrder(id)
    let purchaseOrderTotalPrice = 0
    if (lineItems.length) {
      for (const lineItem  of lineItems) {
        const product = await this.productRepository.findOne({where: {id: lineItem.productId }})
        const lineItemTotalPrice = Number(product.price) * lineItem.quantity
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

  async query(params: PurchaseOrderQueryParams){
    let whereConditions : Partial<PurchaseOrderQueryParams> = {}
    if(params.status){
      whereConditions = {
        ...whereConditions, status: params.status
      }
    }

    if(params.clientId){
      whereConditions = {
        ...whereConditions,
        clientId: params.clientId
      }
    }

   
    const purchaseOrders = await this.repository.find({where: whereConditions, order: {createdAt: 'DESC'}})

    const mappedPurchaseOrders = []
    for(const purchaseOrder of purchaseOrders){
      const supplier = await this.suppliersService.findOne(purchaseOrder.supplierId)
      mappedPurchaseOrders.push({...purchaseOrder, supplier})
    }

    return mappedPurchaseOrders
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
}
