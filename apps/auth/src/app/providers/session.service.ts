import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
    return this.writerClient.session.create({ data });
  }

  async findOneByIdAndUserId(id: string, userId: string) {
    return this.readerClient.session.findUnique({
      where: { id, userId },
    });
  }

  async delete(id: string) {
    return this.writerClient.session.delete({ where: { id } });
  }
}
