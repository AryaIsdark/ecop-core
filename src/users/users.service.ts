import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';
import { Client } from 'src/clients';

export interface ExtendedUser extends User {
  client: Client
}
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) { }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async getUser(username: string): Promise<Partial<ExtendedUser> | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    const client = await this.clientRepository.findOne({ where: { id: user.clientId } })
    return {
      username: user?.username,
      email: user?.email,
      name: user?.name,
      lastname: user?.lastname,
      client
    };
  }
}
