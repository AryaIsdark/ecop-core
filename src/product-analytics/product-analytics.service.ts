import { Injectable } from '@nestjs/common';
import { UpdateProductAnalyticDto } from './dto/update-product-analytic.dto';
import { ProductAnalytic } from './entities/product-analytic.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductAnalyticsService {
  constructor(
    @InjectRepository(ProductAnalytic)
    private readonly repository: Repository<ProductAnalytic>,
  ) {

  }
  async create(createProductAnalyticDto: Partial<ProductAnalytic>) {
    const existing = await this.query({
      orderId: createProductAnalyticDto.orderId,
      product_ean: createProductAnalyticDto.product_ean
    })

    if (existing.length) {
      return
    }

    const productAnalytic = new ProductAnalytic()
    productAnalytic.clientId = createProductAnalyticDto.clientId
    productAnalytic.orderId = createProductAnalyticDto.orderId
    productAnalytic.product_ean = createProductAnalyticDto.product_ean
    productAnalytic.product_sku = createProductAnalyticDto.product_sku
    productAnalytic.count = createProductAnalyticDto.count

    return await this.repository.save(productAnalytic)
  }

  async query(params: Partial<ProductAnalytic>) {
    let whereConditions: Partial<ProductAnalytic> = {}

    if (params.orderId) {
      whereConditions = { ...whereConditions, orderId: params.orderId }
    }
    if (params.product_ean) {
      whereConditions = { ...whereConditions, product_ean: params.product_ean }
    }
    if (params.clientId) {
      whereConditions = { ...whereConditions, clientId: params.clientId }
    }

    return await this.repository.find({ where: whereConditions })
  }

  findAll() {
    return `This action returns all productAnalytics`;
  }

  findOne(id: number) {
    return this.repository.find({ where: { id } });
  }

  update(id: number, updateProductAnalyticDto: UpdateProductAnalyticDto) {
    return `This action updates a #${id} productAnalytic`;
  }

  remove(id: number) {
    return `This action removes a #${id} productAnalytic`;
  }
}
