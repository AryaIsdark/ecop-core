import { Module } from '@nestjs/common';
import { InventorySyncService } from './inventory-sync.service';
import { InventoryModule } from 'src/inventory/inventory.module';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';
import { WicsWmsConnectorModule } from 'src/wics-wms-connector/wics-wms-connector.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';
import { ProductsModule } from 'src/products';

@Module({
  imports: [
    ProductsModule,
    ShopifyConnectorModule,
    InventoryModule,
    EcommercePlatformsModule,
    ShopifyConnectorModule,
    WarehouseManagementSystemsModule,
    OngoingWmsConnectorModule,
    WicsWmsConnectorModule,
    ],
  providers: [InventorySyncService],
  exports: [InventorySyncService]
})
export class InventorySyncModule { }
