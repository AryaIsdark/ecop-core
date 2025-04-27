import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductsQueryParams } from './entities/product.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { SuppliersService } from 'src/suppliers';
import { Paginate } from 'src/base/paginate';
import { normalizeEAN } from 'src/utils/normalize-ean/normalize-ean';
import { ProductMediaService } from 'src/product-media';
import { normalizeDate } from 'src/utils/normalize-date/normalize-date';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly inventoryService: InventoryService,
    private readonly suppliersService: SuppliersService,
    private readonly productMediaSerivce: ProductMediaService,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async getClientProducts(clientId: number) {
    const products = await this.repository.find({
      where: { tenantId: clientId },
    });
    const mappedProducts = [];
    for (const product of products) {
      const supplier = await this.suppliersService.findOne(product.supplierId);
      mappedProducts.push({ ...product, supplier });
    }

    return mappedProducts;
  }

  async query(
    params: ProductsQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Product>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;
    let whereConditions: Record<string, any> = {};

    if (params.tenantId) {
      whereConditions.tenantId = params.tenantId;
    }
    if (params.supplierId) {
      whereConditions.supplierId = params.supplierId;
    }
    if (params.ean) {
      whereConditions.ean = ILike(`%${params.ean}%`);
    }
    if (params.ean_normalized) {
      whereConditions.ean_normalized = ILike(`%${params.ean_normalized}%`);
    }
    if (params.sku) {
      whereConditions.sku = ILike(`%${params.sku}%`);
    }
    if (params.brand) {
      whereConditions.brand = ILike(`%${params.brand}%`);
    }
    if (params.name) {
      whereConditions.name = ILike(`%${params.name}%`);
    }
    if (params.trending_score) {
      whereConditions.trending_score = params.trending_score;
    }

    const [products, count] = await this.repository.findAndCount({
      where: whereConditions,
      take,
      skip,
    });
    const productsWithInventory = [];

    for (const product of products) {
      const inventoryInfo = await this.inventoryService.findWithEan(
        product.ean_normalized,
        product.tenantId,
      );
      const media = await this.productMediaSerivce.getProductMedia(
        product.ean_normalized,
        product.tenantId,
      );
      const supplier = await this.suppliersService.findOne(product.supplierId);
      productsWithInventory.push({
        ...product,
        inventoryInfo,
        supplier,
        media,
      });
    }

    return {
      count,
      data: productsWithInventory,
    };
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const product = await this.repository.findOne({ where: { id } });
    const inventoryInfo = await this.inventoryService.findWithEan(
      product.ean_normalized,
      product.tenantId,
    );

    return { ...product, inventoryInfo };
  }
  async update(id: number, updateProductDto: UpdateProductDto) {
    // Find the product by ID
    const product = await this.repository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update the product with new values
    Object.assign(product, updateProductDto);

    // Save the updated product to the database
    return await this.repository.save(product);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async upserProducts(
    tenantId: number,
    supplierId: number,
    products: Partial<Product>[],
  ) {
    try {
      await this.entityManager.transaction(
        async (transactionalEntityManager) => {
          for (const product of products) {
            if (product) {
              const { id, ...productDataWithoutId } = product; // Exclude 'id' from the product data

              await transactionalEntityManager.upsert(
                Product,
                {
                  ...productDataWithoutId,
                  supplierId,
                  tenantId,
                },
                ['sku', 'tenantId'],
              );
            }
          }
        },
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async resetProductStockBySupplier(tenantId: number, supplierId: number) {
    const clientProducts = await this.repository.find({
      where: { tenantId, supplierId },
    });
    const updates = [];
    for (const product of clientProducts) {
      updates.push({ ...product, stock: '0' });
    }

    return await this.repository.save(updates);
  }
}
