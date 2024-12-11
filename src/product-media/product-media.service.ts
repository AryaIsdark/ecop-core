import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { ProductMedia, ProductMediaStatus } from './entities/product-media.entity';
import * as crypto from 'crypto';

@Injectable()
export class ProductMediaService {
  private readonly concurrencyLimit = 50; // Adjustable concurrency limit

  constructor(
    @InjectRepository(ProductMedia)
    private readonly productMediaRepository: Repository<ProductMedia>,
    @Inject('CORE_ENV_VARIABLES') private readonly envVariables: Record<string, any>,
  ) {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    cloudinary.config({
      cloud_name:  this.envVariables.CLOUDINARY_CLOUD_NAME,
      api_key: this.envVariables.CLOUDINARY_API_KEY,
      api_secret: this.envVariables.CLOUDINARY_API_SECRET,
    });
  }

  private generateHash(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  async getAllMedia(): Promise<ProductMedia[]> {
    return this.productMediaRepository.find();
  }

  async getProductMedia(productEan: string, clientId:number): Promise<ProductMedia[]> {
    return this.productMediaRepository.find({ where: { product_ean: productEan, clientId } });
  }

  private async uploadToCloudinary(url: string, clientId: number): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(url, { resource_type: 'auto', folder: `client-id-${clientId}` });
  }

  private async saveMediaRecord(dto: CreateProductMediaDto, urlHash: string, mediaUrl: string, status: ProductMediaStatus): Promise<ProductMedia> {
    const productMedia = this.productMediaRepository.create({
      ...dto,
      thumbnail_url: mediaUrl,
      media_url: mediaUrl,
      url_hash: urlHash,
      status,
    });

    return this.productMediaRepository.save(productMedia);
  }

  async uploadFromUrl(uploadData: { url: string; createProductMediaDto: CreateProductMediaDto }[]) {
    if (!uploadData.length) {
      throw new BadRequestException('No data provided');
    }

    const uploadResults: { result?: ProductMedia; dto?: CreateProductMediaDto; error?: any }[] = [];

    const processBatch = async (batch: { url: string; createProductMediaDto: CreateProductMediaDto }[]) => {
      const promises = batch.map(async ({ url, createProductMediaDto }) => {
        try {
          const urlHash = this.generateHash(url);

          const existingMedia = await this.productMediaRepository.findOne({
            where: { url_hash: urlHash, status: ProductMediaStatus.UPLOADED, clientId: createProductMediaDto.clientId },
          });

          if (existingMedia) {
            console.log(`Skipping upload for existing media: ${url}`);
            return { result: existingMedia, dto: createProductMediaDto };
          }

          const { secure_url } = await this.uploadToCloudinary(url, createProductMediaDto.clientId);
          const savedMedia = await this.saveMediaRecord(createProductMediaDto, urlHash, secure_url, ProductMediaStatus.UPLOADED);
          return { result: savedMedia, dto: createProductMediaDto };
        } catch (error) {
          return { error, dto: createProductMediaDto };
        }
      });

      return Promise.all(promises);
    };

    while (uploadData.length) {
      const batch = uploadData.splice(0, this.concurrencyLimit);
      const batchResults = await processBatch(batch);
      uploadResults.push(...batchResults);
    }

    const successfulUploads = uploadResults.filter((entry) => entry.result);
    const failedUploads = uploadResults.filter((entry) => entry.error);

    if (failedUploads.length) {
      console.warn('Some uploads failed:', failedUploads.map((entry) => entry.dto));
    }

    return successfulUploads.map((entry) => entry.result);
  }

  async uploadFile(file: Express.Multer.File, createProductMediaDto: CreateProductMediaDto): Promise<ProductMedia> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const urlHash = this.generateHash(file.originalname);

    const existingMedia = await this.productMediaRepository.findOne({
      where: { url_hash: urlHash, status: ProductMediaStatus.UPLOADED },
    });

    if (existingMedia) {
      console.log(`Skipping upload for existing media: ${file.originalname}`);
      return existingMedia;
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: `client-id-${createProductMediaDto.clientId}` },
        async (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            await this.saveMediaRecord(createProductMediaDto, urlHash, '', ProductMediaStatus.FAILED);
            return reject(new BadRequestException(`Cloudinary upload error: ${error.message}`));
          }

          try {
            const savedMedia = await this.saveMediaRecord(createProductMediaDto, urlHash, result.secure_url, ProductMediaStatus.UPLOADED);
            resolve(savedMedia);
          } catch (dbError) {
            reject(new BadRequestException('Error saving media to database'));
          }
        },
      );

      uploadStream.end(file.buffer);
    });
  }
}
