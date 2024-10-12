import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users';
import { AppRole } from 'src/users/entities';

export type JwtTokenProps = {
  userId: number,
  username: string,
  clientId: number
  role: AppRole
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  extractTokenPayload(authorization: string) : JwtTokenProps {
    const token = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    return decodedToken;
  }


  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, userId: user.id, username: user.username, clientId: user.clientId, role: user.role ?? AppRole.TENANT_USER };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
