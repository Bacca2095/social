import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateSessionDto, PrismaService } from '@social/common';

@Injectable()
export class SessionService {
  private readerClient: PrismaClient;
  private writerClient: PrismaClient;

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
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new RpcException({
              code: 409,
              message: 'Session already exists',
            });
          default:
            throw new RpcException({
              code: 422,
              message: 'Unprocessable entity',
            });
        }
      }
      throw new RpcException({ code: 500, message: error.message });
    }
  }

  async findOneByIdAndUserId(id: string, userId: string) {
    try {
      return this.readerClient.session.findUnique({
        where: { id, userId },
      });
    } catch (error) {
      throw new RpcException({ code: 500, message: error.message });
    }
  }

  async delete(id: string) {
    try {
      const [session] = await this.writerClient.$transaction([
        this.writerClient.session.delete({ where: { id } }),
      ]);
      return session;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new RpcException({
              code: 409,
              message: 'Session not found',
            });
          default:
            throw new RpcException({
              code: 422,
              message: 'Unprocessable entity',
            });
        }
      }
      throw new RpcException({ code: 500, message: error.message });
    }
  }
}
