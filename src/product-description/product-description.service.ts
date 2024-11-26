import { Injectable } from '@nestjs/common';
import { CreateProductDescriptionDto } from './dto/create-product-description.dto';
import { UpdateProductDescriptionDto } from './dto/update-product-description.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductDescription } from './entities/product-description.entity';
import { Repository } from 'typeorm';
import { ClientsService } from 'src/clients';
import { ShopifyConfig, ShopifyConnectorService } from 'src/shopify-connector/shopify-connector.service';

@Injectable()
export class ProductDescriptionService {
  constructor(@InjectRepository(ProductDescription)
  private readonly repository: Repository<ProductDescription>,
    private readonly clientsService: ClientsService,
    private readonly shopifyConnectorService: ShopifyConnectorService) {

  }


  async getProductDescriptions(clientId, product_ean: string) {
    return await this.repository.find({ where: { clientId, product_ean } })
  }

  async updateStoreProductDescription(clientId: number, ean: string, description: string) {
    const clientEcommercePlatform = await this.clientsService.getEcommercePlatofmJobConfigurations(clientId)
    const ecommercePlatform = clientEcommercePlatform[0]
    if (ecommercePlatform.ecommercePlatform.name = 'shopify') {
      await this.shopifyConnectorService.updateProductDescription(clientEcommercePlatform[0].config as ShopifyConfig, ean, description )
    }
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

      const response = await this.repository.save(productDescription)
      await this.updateStoreProductDescription(clientId, payload.product_ean, payload.description)

      return response
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
