import { Injectable } from '@nestjs/common';
import { CreateProductDescriptionDto } from './dto/create-product-description.dto';
import { UpdateProductDescriptionDto } from './dto/update-product-description.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDescription } from './entities/product-description.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductDescriptionService {
  constructor(@InjectRepository(ProductDescription)
  private readonly repository: Repository<ProductDescription>) {

  }


  async getProductDescriptions(clientId, product_ean: string) {
    return await this.repository.find({ where: { clientId, product_ean } })
  }

  async upsert(clientId: number, payload: Partial<CreateProductDescriptionDto>) {
    try {
      let productDescription = await this.repository.findOne({ where: { clientId, language_code: payload.language_code, product_ean: payload.product_ean } })
      if (!productDescription) {
        productDescription = new ProductDescription()
        productDescription.clientId = clientId
        productDescription.product_ean = payload.product_ean
        productDescription.language_code = payload.language_code
      }

      productDescription.description = payload.description

      return await this.repository.save(productDescription)
    }
    catch (e) {
      console.error(e)
    }

  }
  create(createProductDescriptionDto: CreateProductDescriptionDto) {
    return 'This action adds a new productDescription';
  }

  findAll() {
    return `This action returns all productDescription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productDescription`;
  }

  update(id: number, updateProductDescriptionDto: UpdateProductDescriptionDto) {
    return `This action updates a #${id} productDescription`;
  }

  remove(id: number) {
    return `This action removes a #${id} productDescription`;
  }
}
