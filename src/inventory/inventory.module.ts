import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities';
import { ClientsModule } from 'src/clients';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]), ClientsModule, OngoingWmsConnectorModule],
  providers: [InventoryService],
  exports: [InventoryService]
})
export class InventoryModule { }
