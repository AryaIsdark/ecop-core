import { Injectable } from '@nestjs/common';
import { UpserPurchaseOrderSuggestionDto } from './dto/create-purchase-order-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderSuggestion } from './entities';
import { LessThan, Repository } from 'typeorm';
import { Product, ProductsService } from 'src/products';
import { Inventory } from 'src/inventory/entities';
import { identifyCheapestProducts } from 'src/utils';

@Injectable()
export class PurchaseOrderSuggestionsService {
  constructor(
    @InjectRepository(PurchaseOrderSuggestion)
    private readonly repository: Repository<PurchaseOrderSuggestion>,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async hasSupplierProductInStock(stockValue: string) {
    const stock = parseInt(stockValue);
    return !isNaN(stock) && stock > 0;
  }

  getSupplierStock(stockValue: string) {
    const stock = parseFloat(stockValue);
    return stock
  }

  filterAvailableProducts(products: Product[]) {
    return products.filter((p) => {
      const supplierStock = this.getSupplierStock(p.stock)
      if (supplierStock > 0) {
        return p
      }
    })
  }

  async suggestPurchaseOrders(clientId, supplierId) {
    const suggestions: UpserPurchaseOrderSuggestionDto[] = []
    const inventories = await this.inventoryRepository.find({ where: { clientId, stock_balance: LessThan(0) } })
    const supplierProducts = await this.productRepository.find({ where: { tenantId: clientId } })
    const availableProducts = this.filterAvailableProducts(supplierProducts);

    for (const inventory of inventories) {
      const products = availableProducts.filter((p) => p.ean_normalized === inventory.product_ean)

      let matchProduct: Product

      if (products.length == 1) {
        matchProduct = products[0]
      }

      if (products.length > 1) {
        matchProduct = identifyCheapestProducts(products)?.[0] as unknown as Product
      }

      if (matchProduct?.supplierId === supplierId) {
        const suggestion: UpserPurchaseOrderSuggestionDto = {
          id: matchProduct.id,
          product_ean: matchProduct.ean_normalized,
          product_sku: matchProduct.sku,
          quantity: this.suggestPurchaseOrderCandidateQuantity(inventory),
          clientId: clientId,
        }

        suggestions.push(suggestion)
      }

    }

    return suggestions
  }

  suggestPurchaseOrderCandidateQuantity(inventory: Inventory) {
    
    // if(inventory.minimum_reorder_amount > 0){
    //   return inventory.minimum_reorder_amount 
    // }

    return Math.abs(inventory.stock_balance)
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
