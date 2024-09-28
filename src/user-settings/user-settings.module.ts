import { Module } from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSetting } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserSetting])],
  providers: [UserSettingsService],
  exports : [UserSettingsService]
})
export class UserSettingsModule {}
