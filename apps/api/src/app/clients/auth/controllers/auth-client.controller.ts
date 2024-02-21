import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '@social/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthClientService } from '../providers/auth-client.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authClientService.login(data);
  }
}
