import { Module } from '@nestjs/common';
import { WarehouseManagementSystemsService } from './warehouse-management-systems.service';
import { WarehouseManagementSystemsController } from './warehouse-management-systems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WarehouseManagementSystem } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([WarehouseManagementSystem])],
  controllers: [WarehouseManagementSystemsController],
  providers: [WarehouseManagementSystemsService],
  exports: [WarehouseManagementSystemsService]
})
export class WarehouseManagementSystemsModule {}
