import { Injectable } from '@nestjs/common';
import { UpserPurchaseOrderSuggestionDto } from './dto/create-purchase-order-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderSuggestion } from './entities';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { JobConfiguration } from 'src/job-configurations';
import { Product, ProductsService } from 'src/products';
import { PurchaseOrdersService } from 'src/purchase-orders';
import { Order, OrdersService } from 'src/orders';
import { PurchaseOrderLineItemsService } from 'src/purchase-order-line-items';
import { OrderLine, OrderLinesService } from 'src/order-lines';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities';


@Injectable()
export class PurchaseOrderSuggestionsService {
  constructor(
    @InjectRepository(PurchaseOrderSuggestion)
    private readonly repository: Repository<PurchaseOrderSuggestion>,
    private productsService: ProductsService,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private orderLinesService: OrderLinesService,
  ) { }

  private calculateReorderPoint(product: Product, recentOrders: OrderLine[], stock: number): number {
    // Simple demand estimation based on recent orders for the product
    // const demand = recentOrders
    //   .filter((order) => order.product_ean === product.ean)
    //   .reduce((acc, order) => acc + order.quantity, 0);

    const leadTime = 1 || 7; // Default to 7 days lead time
    const safetyStock = 0; // Example safety stock

    // Calculate reorder point
    // const reorderPoint = (demand * leadTime) + safetyStock;

    // If stock is below reorder point, return the quantity that needs to be ordered
    // if (stock < reorderPoint) {
    //     return reorderPoint - stock;
    // }

    // No need to reorder if stock is sufficient
    return 0;
  }

  async suggestPurchaseOrders(clientId, supplierId): Promise<UpserPurchaseOrderSuggestionDto[]> {
    const suggestions: UpserPurchaseOrderSuggestionDto[] = [];
    const candidates = await this.inventoryRepository.find({ where: { sellable_number_of_items: LessThan(1), number_of_book_items: MoreThan(0) } })
    const supplierProducts = await this.productsService.query({supplierId, pageNumber: 1, pageSize:50000})
    for(const candidate of candidates){
      const matchProduct = supplierProducts.data.find((supplierProduct)=> candidate.article_number === supplierProduct.ean_normalized)
      if(matchProduct?.id){
        const suggestion: UpserPurchaseOrderSuggestionDto = {
          id: matchProduct.id,
          product_ean: matchProduct.ean,
          product_sku: matchProduct.sku,
          quantity: 1,
          clientId: clientId,
        };

        suggestions.push(suggestion);
      }
    }
    return suggestions
  }

  async suggestPurchaseOrders_old(clientId: number, supplierId?: number): Promise<UpserPurchaseOrderSuggestionDto[]> {
    const suggestions: UpserPurchaseOrderSuggestionDto[] = [];

    // Fetch data from the database
    const products = await this.productsService.query({ tenantId: clientId, supplierId, pageNumber: 1, pageSize: 100000 })
    // const existingPurchaseOrders = await this.purchaseOrderLineItemsService.getClientLineItems(clientId)
    // const recentOrders = await this.orderLinesService.getClientOrderLines(clientId, 1000);

    // Process each product
    for (const product of products.data) {
      const selleableNumberOfItems = product['inventoryInfo']?.['sellable_number_of_items'] ?? 0
      // const existingPO = existingPurchaseOrders.find((po) => po. === product.sku);

      // Calculate reorder point (simple logic, can be replaced with your logic)
      // const reorderPoint = this.calculateReorderPoint(product, recentOrders, stock);

      // Suggest an order if stock is below reorder point and no existing PO covers it
      if (selleableNumberOfItems < 0) {
        const quantityToOrder = selleableNumberOfItems * -1

        const suggestion: UpserPurchaseOrderSuggestionDto = {
          id: product.id,
          product_ean: product.ean,
          product_sku: product.sku,
          quantity: quantityToOrder,
          clientId: clientId,
        };

        suggestions.push(suggestion);
      }
    }

    return suggestions;
  }

  async upsert(params: Partial<UpserPurchaseOrderSuggestionDto>) {
    const existing = await this.repository.findOneBy({ product_ean: params.product_ean, clientId: params.clientId })
    if (existing) {
      this.update(params)
    }
    else {
      this.create(params)
    }
  }

  async create(params: Partial<UpserPurchaseOrderSuggestionDto>) {
    // Create a new purchaseOrderSuggestion record
    const newPurchaseOrderSuggestion = this.repository.create({
      product_ean: params.product_ean,
      product_sku: params.product_sku,
      quantity: params.quantity,
      clientId: params.clientId
    });

    // Save the new entity in the database
    await this.repository.save(newPurchaseOrderSuggestion);
    return `PurchaseOrderSuggestion with product_ean ${params.product_ean} created successfully.`;
  }

  async update(params: Partial<UpserPurchaseOrderSuggestionDto>) {

    await this.repository.update(
      { product_ean: params.product_ean, clientId: params.clientId },
      {
        product_sku: params.product_sku,
        quantity: params.quantity,
        clientId: params.clientId,
      }
    );

    return `PurchaseOrderSuggestion with product_ean ${params.product_ean} updated successfully.`;
  }

  findAll() {
    return `This action returns all purchaseOrderSuggestions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseOrderSuggestion`;
  }


  remove(id: number) {
    return `This action removes a #${id} purchaseOrderSuggestion`;
  }
}
