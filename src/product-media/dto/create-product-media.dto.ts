import { ProductMediaType } from '../entities/product-media.entity';

export class CreateProductMediaDto {
    product_ean: string;
    clientId: number;
    type: ProductMediaType;
}
