import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import {
  LoginDto,
  QueueServiceName,
  UserCommand,
  UserDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(QueueServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy
  ) {}

  async login(data: LoginDto): Promise<{ token: string }> {
    try {
      const user = await lastValueFrom<UserDto>(
        this.userClient.send(UserCommand.VALIDATE, data)
      );

      const token = await this.jwtService.signAsync({
        sub: user.id,
        user: user,
      });

      return { token };
    } catch (error) {
      console.error(error);
    }
  }

  validateToken(jwt: string): Promise<boolean> {
    return this.jwtService.decode(jwt);
  }
}
