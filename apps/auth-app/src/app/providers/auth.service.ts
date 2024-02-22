import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  JwtPayloadDto,
  LoginDto,
  MailCommand,
  QueueServiceName,
  SignUpDto,
  TokenDto,
  UserCommand,
  UserDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

import { SessionService } from './session.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @Inject(QueueServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy,
    @Inject(QueueServiceName.MAIL_SERVICE)
    private readonly mailClient: ClientProxy,
    private readonly sessionService: SessionService
  ) {}

  async login(data: LoginDto): Promise<TokenDto> {
    try {
      const user = await lastValueFrom<UserDto>(
        this.userClient.send(UserCommand.VALIDATE, data)
      );

      return this.generateToken(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async signUp(data: SignUpDto): Promise<TokenDto> {
    try {
      const user = await lastValueFrom<UserDto>(
        this.userClient.send(UserCommand.CREATE, data)
      );

      this.mailClient.emit(MailCommand.SEND_NEW_USER_MAIL, {
        email: user.email,
        fullName: user.fullName,
      });

      return this.generateToken(user);
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout(jwt: string): Promise<void> {
    try {
      const decoded = this.jwtService.decode<JwtPayloadDto>(jwt);
      await this.sessionService.delete(decoded.sessionId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async validateToken(jwt: string): Promise<JwtPayloadDto | null> {
    try {
      const decoded = this.jwtService.decode<JwtPayloadDto>(jwt);
      const session = await this.sessionService.findOneByIdAndUserId(
        decoded.sessionId,
        decoded.sub
      );

      if (!session) {
        return null;
      }
      return decoded;
    } catch (error) {
      this.handleError(error);
    }
  }

  async generateToken(user: UserDto): Promise<TokenDto> {
    try {
      const { password, ...rest } = user;
      const session = await this.sessionService.create({
        userId: user.id,
      });

      const token = await this.jwtService.signAsync({
        sub: user.id,
        user: rest,
        sessionId: session.id,
      });

      return { token };
    } catch (error) {
      this.handleError(error);
    }
  }

  handleError(error: { code?: number; message: string }): never {
    throw new RpcException({
      code: error?.code || HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
}
