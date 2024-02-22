import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthCommand,
  LoginDto,
  QueueServiceName,
  SignUpDto,
  TokenDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  constructor(
    @Inject(QueueServiceName.AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  async login(data: LoginDto): Promise<TokenDto> {
    try {
      return await lastValueFrom(this.authClient.send(AuthCommand.LOGIN, data));
    } catch (error) {
      if (error?.code) {
        throw new HttpException(error.message, error.code);
      }
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async signUp(data: SignUpDto): Promise<TokenDto> {
    try {
      return await lastValueFrom(
        this.authClient.send(AuthCommand.SIGN_UP, data)
      );
    } catch (error) {
      if (error?.code) {
        throw new HttpException(error.message, error.code);
      }
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(jwt: string): Promise<void> {
    try {
      this.authClient.emit(AuthCommand.LOGOUT, { jwt });
    } catch (error) {
      if (error?.code) {
        throw new HttpException(error.message, error.code);
      }
      throw new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
