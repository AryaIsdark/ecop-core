import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
