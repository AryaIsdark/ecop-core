import { Injectable } from '@nestjs/common';
import { CreateUserSettingDto } from './dto/create-user-setting.dto';
import { UpdateUserSettingDto } from './dto/update-user-setting.dto';
import { Repository } from 'typeorm';
import { UserSetting } from './entities';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserSettingsService {
  constructor(@InjectRepository(UserSetting)
  private readonly repository: Repository<UserSetting>,) {

  }

  async upsert(createUserSettingDto: CreateUserSettingDto) {
    const userSetting = await this.repository.findOne({
      where: {
        category: createUserSettingDto.category,
        key: createUserSettingDto.key,
        userId: createUserSettingDto.userId
      }
    });

    if (!userSetting) {
      const newUserSetting = this.repository.create(createUserSettingDto);
      return await this.repository.save(newUserSetting);
    }

    Object.assign(userSetting, createUserSettingDto);
    return await this.repository.save(userSetting);
  }

  create(createUserSettingDto: CreateUserSettingDto) {

  }

  getByUserId(userId: number) {
    return this.repository.find({ where: { userId } })
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} userSetting`;
  }
}
