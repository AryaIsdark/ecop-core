import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { InventoryService } from 'src/inventory/inventory.service';
import { SuppliersService } from 'src/suppliers';


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

  async query(params: Partial<Product>) {
    let whereConditions : Partial<Product> = {}
    if(params.tenantId){
      whereConditions = {...whereConditions, tenantId: params.tenantId}
    }
    if(params.supplierId){
      whereConditions = {...whereConditions, supplierId: params.supplierId}
    }
    if(params.ean){
      whereConditions = {...whereConditions, ean: params.ean}
    }
    if(params.brand){
      whereConditions = {...whereConditions, brand: params.brand}
    }
    if(params.name){
      whereConditions = {...whereConditions, brand: params.name}
    }

    const products = await this.repository.find({where : whereConditions})
    const productsWithInventory = []

    for(const product of products){
      const inventoryInfo = await this.inventoryService.findWithEan(product.ean)
      const supplier = await this.suppliersService.findOne(product.supplierId);
      productsWithInventory.push({...product, inventoryInfo, supplier})
    }

    return productsWithInventory
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({where : {id}})
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
