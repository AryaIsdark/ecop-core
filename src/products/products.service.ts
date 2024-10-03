import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductsQueryParams } from './entities/product.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { SuppliersService } from 'src/suppliers';
import { Paginate } from 'src/base/paginate';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly inventoryService: InventoryService,
    private readonly suppliersService: SuppliersService
  ) {

  }
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async query(
    params: ProductsQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Product>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;
    let whereConditions : Record<string, any> = {

    }

    if (params.tenantId) {
      whereConditions.tenantId =  params.tenantId 
    }
    if (params.supplierId) {
      whereConditions.supplierId = params.tenantId
    }
    if (params.ean) {
      whereConditions.ean = ILike(`%${params.ean}%`) 
    }
    if (params.sku) {
      whereConditions.sku = ILike(`%${params.sku}%`) 
    }
    if (params.brand) {
      whereConditions.brand = ILike(`%${params.brand}%`) 
    }
    if (params.name) {
      whereConditions.name = ILike(`%${params.name}%`) 
    }

    const [products, count] = await this.repository.findAndCount({ where: whereConditions, take, skip })
    const productsWithInventory = []

    for (const product of products) {
      const inventoryInfo = await this.inventoryService.findWithEan(product.ean, product.tenantId)
      const supplier = await this.suppliersService.findOne(product.supplierId);
      productsWithInventory.push({ ...product, inventoryInfo, supplier })
    }

    return {
      count,
      data: productsWithInventory
    }
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } })
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async upserProducts(
    tenantId: number,
    supplierId: number,
    products: Product[],
  ) {
    try {
      await this.entityManager.transaction(async (transactionalEntityManager) => {
        for (const product of products) {
          if (product) {
            const { id, ...productDataWithoutId } = product; // Exclude 'id' from the product data
            
            await transactionalEntityManager.upsert(
              Product,
              { ...productDataWithoutId, supplierId, tenantId }, // Insert product data without 'id'
              ['sku', 'tenantId'],
            );
          }
        }
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

}
