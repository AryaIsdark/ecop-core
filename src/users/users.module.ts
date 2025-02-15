import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities';
import { UsersService } from './users.service';
import { Client } from 'src/clients';

@Module({
  imports: [TypeOrmModule.forFeature([User, Client])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule { }
