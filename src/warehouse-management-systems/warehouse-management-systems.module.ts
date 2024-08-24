import { Module } from '@nestjs/common';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseManagementSystem])],
  providers: [WarehouseManagementSystemsService],
  exports: [WarehouseManagementSystemsService]
})
export class WarehouseManagementSystemsModule {}
