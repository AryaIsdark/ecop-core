import { Injectable } from '@nestjs/common';
import { UpserPurchaseOrderSuggestionDto } from './dto/create-purchase-order-suggestion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrderSuggestion } from './entities';
import { LessThan, Repository } from 'typeorm';
import { Product, ProductsService } from 'src/products';
import { OrderLinesService } from 'src/order-lines';
import { Inventory } from 'src/inventory/entities';
import { identifyCheapestProducts } from 'src/utils';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';

export const hasStock = (value: string) => {
  const stock = parseInt(value);
  return !isNaN(stock) && stock > 0;
}
@Injectable()
export class PurchaseOrderSuggestionsService {
  constructor(
    @InjectRepository(PurchaseOrderSuggestion)
    private readonly repository: Repository<PurchaseOrderSuggestion>,
    private productsService: ProductsService,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private orderLinesService: OrderLinesService,
  ) { }

  async getCandidates(clientId: number) {
    const candidates = await this.inventoryRepository.createQueryBuilder('inventory')
      .where('inventory.clientId = :clientId', { clientId })
      .andWhere(
        'inventory.actual_stock < 0'
      )
      .getMany();

    return candidates;
  }


  async getCandidatesConsideringStockLimit(clientId: number) {
    const candidates = await this.inventoryRepository.createQueryBuilder('inventory')
      .where('inventory.clientId = :clientId', { clientId })
      .andWhere(
        `CASE 
          WHEN inventory.stock_limit IS NOT NULL THEN inventory.actual_stock < inventory.stock_limit AND inventory.actual_stock < 0
          ELSE inventory.actual_stock < 0 
        END`
      )
      .getMany();

    return candidates;
  }


  async hasSupplierProductInStock(stockValue: string) {
    const stock = parseInt(stockValue);
    return !isNaN(stock) && stock > 0;
  }

  getSupplierStock(stockValue: string) {
    const stock = parseInt(stockValue);
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
    const inventories = await this.inventoryRepository.find({ where: { clientId, actual_stock: LessThan(0) } })
    const supplierProducts = await this.productRepository.find({ where: { tenantId: clientId } })
    const availableProducts = this.filterAvailableProducts(supplierProducts);

    for (const inventory of inventories) {
      const products = availableProducts.filter((p) => p.ean_normalized === inventory.product_ean)

      let matchProduct: Product

      if (products.length == 1) {
        matchProduct = products[0]
      }

      if (products.length > 0) {
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


  suggestPurchaseOrderCandidateQuantity(candidate: Inventory) {
    return Math.abs(candidate.sellable_number_of_items)
  }

  async suggestPurchaseOrders_dep(clientId, supplierId): Promise<UpserPurchaseOrderSuggestionDto[]> {
    const suggestions: UpserPurchaseOrderSuggestionDto[] = [];
    const candidates = await this.getCandidatesConsideringStockLimit(clientId)

    for (const candidate of candidates) {
      if (candidate.product_ean === '0733739047045') {
        console.log('')
      }
      let matchProduct: Product
      const products = await this.productsService.query({ tenantId: clientId, ean_normalized: candidate.product_ean, pageSize: 10, pageNumber: 1 })
      const filteredProducts = products.data.filter((product) => {
        const stock = Number(product.stock); // Converts to a number or NaN
        return !isNaN(stock) && stock > 0;  // Include only valid, positive numbers
      });

      if (filteredProducts.length === 1) {
        matchProduct = filteredProducts[0]
      }
      if (filteredProducts.length > 1) {
        matchProduct = identifyCheapestProducts(products.data)?.[0] as unknown as Product
      }

      if (matchProduct?.supplierId === supplierId) {
        const suggestion: UpserPurchaseOrderSuggestionDto = {
          id: matchProduct.id,
          product_ean: normalizeEAN(matchProduct.ean),
          product_sku: matchProduct.sku,
          quantity: this.suggestPurchaseOrderCandidateQuantity(candidate),
          clientId: clientId,
        };

        suggestions.push(suggestion);
      }
    }
    return suggestions
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
