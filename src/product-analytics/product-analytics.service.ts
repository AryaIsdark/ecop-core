import { Injectable } from '@nestjs/common';
import { UpdateProductAnalyticDto } from './dto/update-product-analytic.dto';
import { ProductAnalytic } from './entities/product-analytic.entity';
import { LessThan, Repository, MoreThan } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobConfiguration } from 'src/job-configurations';
import { ProductTrendingScore, ProductsService } from 'src/products';

export enum TRENDING_RANGE {
  SINCE_LAST_WEEK='since_last_week',
  SINCE_LAST_MONTH='since_last_month'
}

export type MarkTrendingProductsJobConfiguration = {
  trending_range: TRENDING_RANGE,
  trending_score_low?: number,
  trending_score_high?: number,
  trending_score_medium?: number
}

@Injectable()
export class ProductAnalyticsService {
  constructor(
    @InjectRepository(ProductAnalytic)
    private readonly repository: Repository<ProductAnalytic>,
    private readonly productsService: ProductsService
  ) {

  }

  translateTrendingRange(range: TRENDING_RANGE): Date {
    const currentDate = new Date();

    if (range === TRENDING_RANGE.SINCE_LAST_WEEK) {
      currentDate.setDate(currentDate.getDate() - 7);
      return currentDate;
    }

    if (range === TRENDING_RANGE.SINCE_LAST_MONTH) {
      currentDate.setMonth(currentDate.getMonth() - 1);
      return currentDate;
    }

    throw new Error(`Unsupported TRENDING_RANGE value: ${range}`);
  }

  async handleMarkTrendingProducts(jobConfiguration: JobConfiguration): Promise<string> {
    const { tenantId, config } = jobConfiguration;

    const clientProductAnalytics = await this.repository.find({
      where: {
        clientId: tenantId,
        createdAt: MoreThan(this.translateTrendingRange(config.trending_range)),
      },
    });

    const productMap = this.aggregateProductCounts(clientProductAnalytics);

    await this.updateTrendingScores(productMap, tenantId, config as unknown as MarkTrendingProductsJobConfiguration);

    return 'Successfully finished marking trending products';
  }

  private aggregateProductCounts(analytics: Array<{ product_ean: string; count: number }>): Map<string, number> {
    const productMap = new Map<string, number>();

    for (const { product_ean, count } of analytics) {
      productMap.set(product_ean, (productMap.get(product_ean) || 0) + count);
    }

    return productMap;
  }

  private async updateTrendingScores(productMap: Map<string, number>, tenantId: number, config: MarkTrendingProductsJobConfiguration): Promise<void> {
    for (const [product_ean, count] of productMap) {
      const products = await this.productsService.query({
        tenantId,
        ean: product_ean,
        pageNumber: 1,
        pageSize: 100,
      });

      for (const product of products.data) {
        const trendingScore = this.getTrendingScore(config, count);
        if (trendingScore) {
          await this.productsService.update(product.id, { trending_score: trendingScore });
        }
      }
    }
  }

  private getTrendingScore(config: MarkTrendingProductsJobConfiguration, count: number): ProductTrendingScore | null {
    if (count < config.trending_score_low) return ProductTrendingScore.LOW;
    if (count >= config.trending_score_low && count < config.trending_score_medium) return ProductTrendingScore.MID;
    if (count >= config.trending_score_high) return ProductTrendingScore.HIGH;
    return null;
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

  async getOrderQuantityForGivenRange(productEan: string, dateFrom: Date, dateTo: Date) {
    const results = await this.repository.find({
      where: {
        product_ean: productEan,
        createdAt: MoreThan(dateFrom) && LessThan(dateTo),
      }
    })

    return results
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
