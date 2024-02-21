import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { QueueServiceName } from '../enums/queue-service-name.enum';
import { AuthCommand } from '../enums/auth-command.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(QueueServiceName.AUTH_SERVICE)
    private readonly authClient: ClientProxy
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = req.headers?.authorization?.split(' ')[1];

      if (!token) return false;

      const res = await lastValueFrom(
        this.authClient.send(AuthCommand.VALIDATE_TOKEN, {
          jwt: req.headers?.authorization?.split(' ')[1],
        })
      );

      if (res?.user) {
        req.user = res.user;
        return true;
      }

      return false;
    } catch (err) {
      return false;
    }
  }
}
