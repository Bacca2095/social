import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService {
  public readerClient: PrismaClient;
  public writerClient: PrismaClient;

  constructor() {
    this.readerClient = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env['DATABASE_READER_URL']}`,
        },
      },
      log: ['query'],
    });
    this.writerClient = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env['DATABASE_WRITER_URL']}`,
        },
      },
      log: ['query'],
    });
  }
}
