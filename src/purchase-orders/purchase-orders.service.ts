import { Injectable } from '@nestjs/common';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PurchaseOrder, PurchaseOrderStatus } from './entities/purchase-order.entity';
import { Repository } from 'typeorm';
import { SuppliersService } from 'src/suppliers';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly repository: Repository<PurchaseOrder>,
    private readonly suppliersService : SuppliersService
  ) {

  }

  async create(createDto: CreatePurchaseOrderDto): Promise<PurchaseOrder | string> {
    const { supplierId, reference, clientId, } = createDto
    if (createDto.supplierId) {
      const purchaseOrder = new PurchaseOrder();
      purchaseOrder.reference = reference;
      purchaseOrder.supplierId = supplierId;
      purchaseOrder.clientId = clientId;
      purchaseOrder.status = PurchaseOrderStatus.Draft;
      const newPurchaseOrder = await this.repository.save(purchaseOrder);

      return newPurchaseOrder;
    }

    return 'Given supplier does not exist in the system';
  }

  findAll() {
    return this.repository.find();
  }

  async findOne(id: number) {
    const purchaseOrder = await this.repository.findOne({ where: { id } });
    const supplier = await this.suppliersService.findOne(purchaseOrder.supplierId)

    return {...purchaseOrder, supplier}
  }

  update(id: number, updatePurchaseOrderDto: UpdatePurchaseOrderDto) {
    return `This action updates a #${id} purchaseOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseOrder`;
  }
}
