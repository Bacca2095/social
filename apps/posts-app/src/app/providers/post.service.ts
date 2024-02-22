import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreatePostDto,
  ExtendedPrismaClientType,
  FilterPostDto,
  PaginationResponseDto,
  PaginationUtil,
  PostDto,
  PostLikeDto,
  PostMapperUtil,
  PrismaService,
  UpdatePostDto,
} from '@social/common';

@Injectable()
export class PostService {
  private readerClient: ExtendedPrismaClientType;
  private writerClient: ExtendedPrismaClientType;

  constructor(private readonly prismaService: PrismaService) {
    this.readerClient = prismaService.readerClient;
    this.writerClient = prismaService.writerClient;
  }

  async create(data: CreatePostDto, userId: string): Promise<PostDto> {
    try {
      const [post] = await this.writerClient.$transaction([
        this.writerClient.post.create({
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          data: { ...data, userId },
        }),
      ]);
      return PostMapperUtil.toDto(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: string): Promise<PostDto> {
    try {
      const post = await this.readerClient.post.findUniqueOrThrow({
        include: {
          user: {
            select: {
              fullName: true,
            },
          },
        },
        where: { id },
      });

      return PostMapperUtil.toDto(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findMany(
    query: FilterPostDto
  ): Promise<PaginationResponseDto<PostDto>> {
    try {
      const [posts, total] = await this.readerClient.$transaction([
        this.readerClient.post.findMany({
          where: {},
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          take: query.take,
          skip: query.skip,
        }),
        this.readerClient.post.count({
          where: {},
        }),
      ]);

      if (total === 0) {
        return { data: [], totalPages: 0 };
      }

      const formattedPosts = PostMapperUtil.toDtos(posts);

      return PaginationUtil.paginate<PostDto>(
        formattedPosts,
        total,
        query.take
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: string,
    data: UpdatePostDto,
    userId: string
  ): Promise<PostDto> {
    try {
      const [post] = await this.writerClient.$transaction([
        this.writerClient.post.update({
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
          where: { id, userId },
          data,
        }),
      ]);
      return PostMapperUtil.toDto(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete(id: string, userId: string): Promise<PostDto> {
    try {
      const post = await this.writerClient.post.softDelete(id, userId);
      return PostMapperUtil.toDto(post);
    } catch (error) {
      this.handleError(error);
    }
  }

  async like(id: string): Promise<PostLikeDto> {
    try {
      const [post] = await this.writerClient.$transaction([
        this.writerClient.post.update({
          select: {
            id: true,
            likes: true,
          },
          where: { id },
          data: {
            likes: {
              increment: 1,
            },
          },
        }),
      ]);
      return post;
    } catch (error) {
      this.handleError(error);
    }
  }

  async unlike(id: string): Promise<PostLikeDto> {
    try {
      const [post] = await this.writerClient.$transaction([
        this.writerClient.post.update({
          select: {
            id: true,
            likes: true,
          },
          where: { id },
          data: {
            likes: {
              decrement: 1,
            },
          },
        }),
      ]);

      return post;
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
          message = 'Post already exists';
          break;
        case 'P2016':
        case 'P2025':
          errorCode = HttpStatus.NOT_FOUND;
          message = 'Post not found';
          break;
        default:
          errorCode = HttpStatus.UNPROCESSABLE_ENTITY;
          message = 'Unprocessable entity';
      }
    }

    throw new RpcException({ code: errorCode, message: message });
  }
}
