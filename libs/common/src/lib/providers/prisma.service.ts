import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const ExtendedPrismaClient = (url: string) => {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url,
      },
    },
    log: ['query'],
  });

  return prisma.$extends({
    model: {
      user: {
        async softDelete(id: string) {
          const [user] = await prisma.$transaction([
            prisma.user.update({
              where: {
                id,
              },
              data: {
                deletedAt: new Date(),
              },
            }),
          ]);
          return user;
        },
      },
      post: {
        async softDelete(id: string, userId: string) {
          const [post] = await prisma.$transaction([
            prisma.post.update({
              include: {
                user: {
                  select: {
                    fullName: true,
                  },
                },
              },
              where: {
                id,
                userId,
              },
              data: {
                deletedAt: new Date(),
              },
            }),
          ]);
          return post;
        },
      },
      session: {
        async softDelete(id: string) {
          const [session] = await prisma.$transaction([
            prisma.session.update({
              where: {
                id,
              },
              data: {
                deletedAt: new Date(),
              },
            }),
          ]);
          return session;
        },
      },
    },
    query: {
      $allModels: {
        async findMany({ model, operation, args, query }) {
          args.where = { deletedAt: null, ...args.where };

          return query(args);
        },
        async findUniqueOrThrow({ model, operation, args, query }) {
          args.where = { deletedAt: null, ...args.where };

          return query(args);
        },
      },
    },
  });
};

export type ExtendedPrismaClientType = ReturnType<typeof ExtendedPrismaClient>;

@Injectable()
export class PrismaService {
  public readerClient: ExtendedPrismaClientType;
  public writerClient: ExtendedPrismaClientType;

  constructor() {
    this.readerClient = ExtendedPrismaClient(
      `${process.env['DATABASE_READER_URL']}`
    );
    this.writerClient = ExtendedPrismaClient(
      `${process.env['DATABASE_WRITER_URL']}`
    );
  }
}
