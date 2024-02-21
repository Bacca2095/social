import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {
  CreatePostDto,
  FilterPostDto,
  PrismaService,
  UpdatePostDto,
} from '@social/common';

@Injectable()
export class PostService {
  private readerClient: PrismaClient;
  private writerClient: PrismaClient;

  constructor(private readonly prismaService: PrismaService) {
    this.readerClient = prismaService.readerClient;
    this.writerClient = prismaService.writerClient;
  }
  async create(data: CreatePostDto) {
    return this.writerClient.post.create({
      data: { ...data, userId: 'cc5b205f-0d9b-4736-9915-1f81fea14e29' },
    });
  }
  async findOne(id: string) {
    return this.readerClient.post.findUnique({ where: { id } });
  }
  async findMany(query: FilterPostDto) {
    return this.readerClient.post.findMany({
      where: {},
      take: query.take,
      skip: query.skip,
    });
  }
  async update(id: string, data: UpdatePostDto) {
    return this.writerClient.post.update({ where: { id }, data });
  }
  async delete(id: string) {
    return this.writerClient.post.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
