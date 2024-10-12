import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryQueryParams } from './entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, LessThan, MoreThan, Repository } from 'typeorm';
import { Paginate } from 'src/base/paginate';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly repository: Repository<Inventory>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {

  }

  create(createInventoryDto: CreateInventoryDto) {
    return 'This action adds a new inventory';
  }

  findAll() {
    return `This action returns all inventory`;
  }

  findWithEan(ean: string, clientId: number) {
    return this.repository.findOne({ where: { product_ean: ean, clientId } });
  }
  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }

  async query(
    params: InventoryQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Inventory>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;
    let whereConditions : Record<string, any> = {

    }

    if (params.clientId) {
      whereConditions.clientId =  params.clientId 
    }
  
    if (params.product_ean) {
      whereConditions.product_ean = ILike(`%${params.product_ean}%`) 
    }
 
    if (params.product_sku) {
      whereConditions.product_sku = ILike(`%${params.product_sku}%`) 
    }
    if (params.sellable_number_of_items_less_than) {
      whereConditions.sellable_number_of_items = LessThan(params.sellable_number_of_items_less_than)
    }
    if (params.sellable_number_of_items_more_than) {
      whereConditions.sellable_number_of_items = MoreThan(params.sellable_number_of_items_less_than)
    }

    const [inventories, count] = await this.repository.findAndCount({ where: whereConditions, take, skip })

    return {
      count,
      data: inventories
    }
  }

  async upserInventory(
    clientId: number,
    inventories: Inventory[],
  ) {
    try {
      await this.entityManager.transaction(async (transactionalEntityManager) => {
        for (const inventory of inventories) {
          if (inventory) {
            transactionalEntityManager.upsert(
              Inventory,
              { ...inventory, clientId },
              ['product_ean', 'clientId'],
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
