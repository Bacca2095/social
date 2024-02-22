import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { UserDto } from '../dto/user/user.dto';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDto & { sessionId: string } => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('No user found in request');
    }

    return user;
  }
);
