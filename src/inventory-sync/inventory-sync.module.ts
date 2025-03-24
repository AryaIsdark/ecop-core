import { Module } from '@nestjs/common';
import { InventorySyncService } from './inventory-sync.service';
import { InventoryModule } from 'src/inventory/inventory.module';
import { WarehouseManagementSystemsModule } from 'src/warehouse-management-systems';
import { OngoingWmsConnectorModule } from 'src/ongoing-wms-connector/ongoing-wms-connector.module';
import { WicsWmsConnectorModule } from 'src/wics-wms-connector/wics-wms-connector.module';
import { EcommercePlatformsModule } from 'src/ecommerce-platforms';
import { ShopifyConnectorModule } from 'src/shopify-connector/shopify-connector.module';
import { ProductsModule } from 'src/products';
import { ProductAnalyticsModule } from 'src/product-analytics';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from 'src/inventory/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    ProductsModule,
    ShopifyConnectorModule,
    InventoryModule,
    EcommercePlatformsModule,
    ShopifyConnectorModule,
    WarehouseManagementSystemsModule,
    OngoingWmsConnectorModule,
    WicsWmsConnectorModule,
    ProductAnalyticsModule,
    ],
  providers: [InventorySyncService],
  exports: [InventorySyncService]
})
export class InventorySyncModule { }
