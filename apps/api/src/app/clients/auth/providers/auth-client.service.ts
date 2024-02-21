import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AuthCommand,
  LoginDto,
  QueueServiceName,
  SignUpDto,
} from '@social/common';

@Injectable()
export class AuthClientService {
  constructor(
    @Inject(QueueServiceName.AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  login(data: LoginDto) {
    return this.authClient.send(AuthCommand.LOGIN, data);
  }

  signUp(data: SignUpDto) {
    return this.authClient.send(AuthCommand.SIGN_UP, data);
  }
}
