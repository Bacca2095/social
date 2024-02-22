import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthCommand,
  LoginDto,
  QueueServiceName,
  SignUpDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthClientService {
  constructor(
    @Inject(QueueServiceName.AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  login(data: LoginDto) {
    return lastValueFrom(this.authClient.send(AuthCommand.LOGIN, data));
  }

  signUp(data: SignUpDto) {
    return lastValueFrom(this.authClient.send(AuthCommand.SIGN_UP, data));
  }

  async logout(jwt: string): Promise<void> {
    this.authClient.emit(AuthCommand.LOGOUT, { jwt });
  }
}
