import { Injectable } from '@nestjs/common';
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

  findWithEan(ean: string, clientId: number) {
    return this.repository.findOne({ where: { product_ean: ean, clientId } });
  }
  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async getClientInventories(clientId: number) {
    return await this.repository.find({ where: { clientId } })
  }

  async updateStockLimit(id: number, newStockLimit: number){
    const inventory = await this.repository.findOne({where: {id}})
    if(!inventory){
      return 'inventory item not found'
    }

    inventory.stock_limit = newStockLimit

    return await this.repository.save(inventory)
  }

  async query(
    params: InventoryQueryParams = { pageNumber: 1, pageSize: 25 },
  ): Promise<Paginate<Inventory>> {
    const take = params.pageSize;
    const skip = (params.pageNumber - 1) * params.pageSize;
    let whereConditions: Record<string, any> = {

    }

    if (params.clientId) {
      whereConditions.clientId = params.clientId
    }

    if (params.product_ean?.length) {
      whereConditions.product_ean = ILike(`%${params.product_ean}%`)
    }

    if (params.product_sku?.length) {
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
