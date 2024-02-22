import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import {
  AuthCommand,
  JwtPayloadDto,
  LoginDto,
  SignUpDto,
  TokenDto,
} from '@social/common';

import { AuthService } from '../providers/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthCommand.LOGIN)
  async login(data: LoginDto): Promise<TokenDto> {
    const res = await this.authService.login(data);
    return res;
  }

  @MessagePattern(AuthCommand.SIGN_UP)
  async signUp(data: SignUpDto): Promise<TokenDto> {
    const res = await this.authService.signUp(data);
    return res;
  }

  @MessagePattern(AuthCommand.LOGOUT)
  async logout(data: { jwt: string }): Promise<void> {
    await this.authService.logout(data.jwt);
  }

  @MessagePattern(AuthCommand.VALIDATE_TOKEN)
  async validateToken(data: { jwt: string }): Promise<JwtPayloadDto | null> {
    try {
      const res = await this.authService.validateToken(data.jwt);
      return res;
    } catch (e) {
      return null;
    }
  }
}
