import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { SuppliersService } from 'src/suppliers/suppliers.service';


@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly suppliersService: SuppliersService,
  ) {

  }
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
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
            transactionalEntityManager.upsert(
              Product,
              { ...product, supplierId, tenantId },
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
