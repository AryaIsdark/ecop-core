import { Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly repository: Repository<Supplier>,
  ){}
  create(createSupplierDto: CreateSupplierDto) {
    return 'This action adds a new supplier';``
  }

  async upsertSupplier(createUpdateSupplierDto: CreateSupplierDto): Promise<Supplier> {
    try{
      
      const { id, ...supplierData } = createUpdateSupplierDto;
  
      let supplier: Supplier;
      if (id) {
        supplier = await this.findOne(id);
        if (supplier) {
          // Update existing supplier
          Object.assign(supplier, supplierData);
        } else {
          // Create new supplier with specified id
          supplier = this.repository.create(createUpdateSupplierDto);
        }
      } else {
        // Create new supplier without id
        const newSupplier = new Supplier
        newSupplier.logo = 'logo'
        newSupplier.name = createUpdateSupplierDto.name
        newSupplier.email = createUpdateSupplierDto.email
        newSupplier.country = createUpdateSupplierDto.country
        newSupplier.address = createUpdateSupplierDto.address
        supplier = this.repository.create(newSupplier);
      }
  
      return await this.repository.save(supplier);
    }
    catch(e){
      console.error(e)
    }
  }


  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    return await this.repository.findOne({where : {id}});
  }

  update(id: number, updateSupplierDto: UpdateSupplierDto) {
    return `This action updates a #${id} supplier`;
  }

  remove(id: number) {
    return `This action removes a #${id} supplier`;
  }
}
