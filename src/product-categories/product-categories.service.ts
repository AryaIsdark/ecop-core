import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { ProductCategory } from './entities/product-category.entity';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategoryRepository: Repository<ProductCategory>,
  ) { }

  async create(createProductCategoryDto: CreateProductCategoryDto): Promise<ProductCategory> {
    const newCategory = this.productCategoryRepository.create(createProductCategoryDto);
    return await this.productCategoryRepository.save(newCategory);
  }

  async findAll(clientId: number): Promise<ProductCategory[]> {
    return await this.productCategoryRepository.find({ where: { clientId } });
  }

  async findOne(id: number): Promise<ProductCategory> {
    const category = await this.productCategoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<ProductCategory> {
    const category = await this.findOne(id);
    const updatedCategory = this.productCategoryRepository.merge(category, updateProductCategoryDto);
    return await this.productCategoryRepository.save(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const result = await this.productCategoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product category with ID ${id} not found`);
    }
  }
}
