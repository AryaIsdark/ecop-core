import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from 'src/clients';
import { SubscriptionType } from 'src/subscriptions/entities/subscription.entity';
import { SubscriptionConfig, getSubscriptionConfig } from 'src/subscriptions/subscriptions.config';
import { UsersService } from 'src/users';
import { AppRole } from 'src/users/entities';

export type JwtTokenProps = {
  userId: number,
  username: string,
  clientId: number
  role: AppRole
  subscription: SubscriptionConfig
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private clientsService: ClientsService,
    private jwtService: JwtService,
  ) { }

  extractTokenPayload(authorization: string): JwtTokenProps {
    const token = authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token);
    return decodedToken;
  }


  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    let client;
    let subscription;

    if (user.role === AppRole.ECOP_ADMIN) {
      client = {}
      subscription = getSubscriptionConfig(SubscriptionType.UNLIMITED)
    }

    else {
      client = await this.clientsService.findOne(user.clientId)
      subscription = await getSubscriptionConfig(client.subscription.type ?? SubscriptionType.TRIAL)
    }

    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      userId: user.id,
      username: user.username,
      clientId: user.clientId,
      role: user.role ?? AppRole.TENANT_USER,
      subscription
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
