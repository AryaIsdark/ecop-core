import { Injectable } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { Inventory } from './entities';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

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

  findWithEan(ean: string) {
    return this.repository.findOne({where : {product_ean: ean}});
  }
  findOne(id: number) {
    return this.repository.findOne({where : {id }});
  }

  update(id: number, updateInventoryDto: UpdateInventoryDto) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
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
