import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule, UsersService } from 'src/users';
import { ClientsModule } from 'src/clients';

@Module({
  imports: [
    UsersModule,
    ClientsModule,
    JwtModule.register({
      global: true,
      secret: 'some-secret',
      signOptions: { expiresIn: '10d' },
    }),
  ],
  controllers: [],
  providers: [AuthService],
})
export class AuthModule {}
