import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { CreateProductMediaDto } from './dto/create-product-media.dto';
import { ProductMedia } from './entities/product-media.entity';

@Injectable()
export class ProductMediaService {
  constructor(
    @InjectRepository(ProductMedia)
    private readonly productMediaRepository: Repository<ProductMedia>,
  ) {
    cloudinary.config({
      cloud_name: 'dqidbvunr', // Replace with your Cloudinary cloud name
      api_key: '587228776578561', // Replace with your Cloudinary API key
      api_secret: '3CX8xNPaoidAGDHIvstbMzz9h-c', // Replace with your Cloudinary API secret
    });

  }

  async uploadFromUrl(uploadData: { url: string, createProductMediaDto: CreateProductMediaDto }[]) {
    if (!uploadData.length) {
      throw new BadRequestException('No data provided');
    }

    const CONCURRENCY_LIMIT = 10; // Adjust concurrency limit as needed
    const uploadResults: { result?: any; dto?: CreateProductMediaDto; error?: any }[] = [];

    const processQueue = async () => {
      while (uploadData.length) {
        const batch = uploadData.splice(0, CONCURRENCY_LIMIT); // Take a batch of tasks

        const promises = batch.map(async ({ url, createProductMediaDto }) => {
          try {
            const result = await cloudinary.uploader.upload(url, { resource_type: 'auto', folder: 'ProductMedia' });

            const productMedia = this.productMediaRepository.create({
              product_ean: createProductMediaDto.product_ean,
              clientId: createProductMediaDto.clientId,
              type: createProductMediaDto.type,
              thumbnail_url: result.secure_url,
              media_url: result.secure_url, // Use the same URL for thumbnail if no specific thumbnail provided
            });

            const savedMedia = await this.productMediaRepository.save(productMedia);
            return { result: savedMedia, dto: createProductMediaDto }; // Store successful result
          } catch (dbError) {
            return { error: dbError, dto: createProductMediaDto }; // Store error
          }
        });

        // Wait for all promises in the batch to complete
        const batchResults = await Promise.all(promises);

        // Add the batch results to the final results
        uploadResults.push(...batchResults);
      }
    };

    // Process the queue
    await processQueue();

    // Handle the results
    const successfulUploads = uploadResults.filter((entry) => entry.result);
    const failedUploads = uploadResults.filter((entry) => entry.error);

    if (failedUploads.length > 0) {
      console.warn('Some uploads failed:', failedUploads.map((entry) => entry.dto));
    }

    // Return successful uploads
    return successfulUploads.map((entry) => entry.result);
  }


  async uploadFile(file: Express.Multer.File, createProductMediaDto: CreateProductMediaDto): Promise<ProductMedia> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', folder: 'ProductMedia' }, // Automatically detect file type (image/video)
        async (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(new BadRequestException(`Cloudinary upload error: ${error.message}`));
          }

          try {
            // Save uploaded media details to the database
            const productMedia = this.productMediaRepository.create({
              product_ean: createProductMediaDto.product_ean,
              clientId: createProductMediaDto.clientId,
              type: createProductMediaDto.type,
              thumbnail_url: result.secure_url,
              media_url: result.secure_url, // Use the same URL for thumbnail if no specific thumbnail provided
            });

            const savedMedia = await this.productMediaRepository.save(productMedia);
            resolve(savedMedia);
          } catch (dbError) {
            reject(new BadRequestException('Error saving media to database'));
          }
        },
      );

      // Write the file buffer to the upload stream
      uploadStream.end(file.buffer);
    });
  }

  async deleteMedia(id: number): Promise<void> {
    // Find the media entry in the database
    const media = await this.productMediaRepository.findOne({ where: { id } });

    if (!media) {
      throw new BadRequestException('Media not found');
    }

    try {
      // Delete file from Cloudinary
      const publicId = this.extractPublicIdFromUrl(media.media_url);
      await cloudinary.uploader.destroy(publicId);

      // Remove the media record from the database
      await this.productMediaRepository.delete(id);
    } catch (error) {
      throw new BadRequestException('An error occurred while deleting the media');
    }
  }

  private extractPublicIdFromUrl(url: string): string {
    const regex = /\/v\d+\/([^\.]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  async getAllMedia(): Promise<ProductMedia[]> {
    return await this.productMediaRepository.find();
  }

  async getProductMedia(product_ean: string) {
    return await this.productMediaRepository.find({ where: { product_ean } })
  }
}
