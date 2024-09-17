import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory, InventoryQueryParams } from './entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, LessThan, MoreThan, Repository } from 'typeorm';

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

  async query(params: InventoryQueryParams) {
    const where : any = {};

    if (params.sellable_number_of_items_less_than) {
        where.sellable_number_of_items = LessThan(params.sellable_number_of_items_less_than);
    }
    
    if (params.sellable_number_of_items_more_than) {
        where.sellable_number_of_items = MoreThan(params.sellable_number_of_items_more_than);
    }
    
    if (params.clientId) {
        where.clientId = params.clientId;
    }
    
    if (params.product_ean) {
        where.product_ean = params.product_ean;
    }

    if (params.product_sku) {
        where.product_sku = params.product_sku;
    }

    const result = await this.repository.find({
      where
    });

    return result;
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
