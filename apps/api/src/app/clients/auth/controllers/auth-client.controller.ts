import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard, LoginDto, SignUpDto, TokenDto } from '@social/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthClientService } from '../providers/auth-client.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthClientController {
  constructor(private readonly authClientService: AuthClientService) {}

  @Post('login')
  async login(@Body() data: LoginDto): Promise<TokenDto> {
    return this.authClientService.login(data);
  }

  @Post('signup')
  async signUp(@Body() data: SignUpDto): Promise<TokenDto> {
    return this.authClientService.signUp(data);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() request: Request): Promise<boolean> {
    try {
      const jwt = request?.headers['authorization']?.split(' ')[1];
      if (!jwt) {
        throw new UnauthorizedException('Session not found');
      }
      await this.authClientService.logout(jwt);
      return true;
    } catch (error) {
      console.error('Error en logout:', error);
      throw new InternalServerErrorException(
        'Error occurred while logging out.'
      );
    }
  }
}
