import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreateSessionDto,
  ExtendedPrismaClientType,
  PrismaService,
} from '@social/common';

@Injectable()
export class SessionService {
  private readerClient: ExtendedPrismaClientType;
  private writerClient: ExtendedPrismaClientType;

  constructor(private readonly prismaService: PrismaService) {
    this.readerClient = prismaService.readerClient;
    this.writerClient = prismaService.writerClient;
  }

  async create(data: CreateSessionDto) {
    try {
      const [session] = await this.writerClient.$transaction([
        this.writerClient.session.create({ data }),
      ]);
      return session;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOneByIdAndUserId(id: string, userId: string) {
    try {
      return this.readerClient.session.findUnique({
        where: { id, userId },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string) {
    try {
      const session = await this.writerClient.session.softDelete(id);
      return session;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: PrismaClientKnownRequestError): never {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          errorCode = HttpStatus.CONFLICT;
          message = 'Session already exists';
          break;
        case 'P2016':
        case 'P2025':
          errorCode = HttpStatus.NOT_FOUND;
          message = 'Session not found';
          break;
        default:
          errorCode = HttpStatus.UNPROCESSABLE_ENTITY;
          message = 'Unprocessable entity';
      }
    }

    throw new RpcException({ code: errorCode, message: message });
  }
}
