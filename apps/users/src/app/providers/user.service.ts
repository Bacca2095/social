import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreateUserDto,
  FilterUserDto,
  LoginDto,
  PrismaService,
  UpdateUserDto,
  UserDto,
} from '@social/common';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  private readerClient: PrismaClient;
  private writerClient: PrismaClient;

  constructor(private readonly prismaService: PrismaService) {
    this.readerClient = prismaService.readerClient;
    this.writerClient = prismaService.writerClient;
  }
  async create(data: CreateUserDto) {
    try {
      const hashedPassword = hashSync(data.password, 10);
      const user = await this.writerClient.$transaction([
        this.writerClient.user.create({
          data: { ...data, password: hashedPassword },
        }),
      ]);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new RpcException({
              code: 409,
              message: 'Email already exists',
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
  async findOne(id: string) {
    try {
      return this.readerClient.user.findUnique({ where: { id } });
    } catch (error) {
      throw new RpcException({ code: 500, message: error.message });
    }
  }
  async findMany(query: FilterUserDto) {
    try {
      return this.readerClient.user.findMany({
        where: {},
        take: query.take,
        skip: query.skip,
      });
    } catch (error) {
      throw new RpcException({ code: 500, message: error.message });
    }
  }
  async update(id: string, data: UpdateUserDto) {
    try {
      const [user] = await this.writerClient.$transaction([
        this.writerClient.user.update({ where: { id }, data }),
      ]);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new RpcException({ code: 404, message: 'User not found' });
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
  async delete(id: string) {
    try {
      const [user] = await this.writerClient.$transaction([
        this.writerClient.user.update({
          where: { id },
          data: { deletedAt: new Date() },
        }),
      ]);
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new RpcException({ code: 404, message: 'User not found' });
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

  async validate(data: LoginDto): Promise<UserDto> {
    try {
      const result = await this.readerClient.user.findUniqueOrThrow({
        where: { email: data.email },
      });

      const match = compareSync(data.password, result.password);

      if (!match) {
        throw new Error('Incorrect email or password');
      }

      return result;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new RpcException({ code: 404, message: 'User not found' });
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
