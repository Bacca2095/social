import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthCommand, LoginDto, SignUpDto } from '@social/common';

import { AuthService } from '../providers/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AuthCommand.LOGIN)
  async login(data: LoginDto): Promise<{ token: string }> {
    const res = await this.authService.login(data);
    return res;
  }

  @MessagePattern(AuthCommand.SIGN_UP)
  async signUp(data: SignUpDto): Promise<boolean> {
    const res = await this.authService.signUp(data);
    return res;
  }

  @MessagePattern(AuthCommand.VALIDATE_TOKEN)
  async validateToken(data: { jwt: string }): Promise<boolean> {
    try {
      const res = this.authService.validateToken(data.jwt);
      return res;
    } catch (e) {
      return false;
    }
  }
}
