import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  CreateUserDto,
  ExtendedPrismaClientType,
  FilterUserDto,
  LoginDto,
  PaginationResponseDto,
  PaginationUtil,
  PrismaService,
  UpdateUserDto,
  UserDto,
  UserMapperUtil,
  UserWithoutPasswordDto,
} from '@social/common';
import { compareSync, hashSync } from 'bcrypt';

@Injectable()
export class UserService {
  private readerClient: ExtendedPrismaClientType;
  private writerClient: ExtendedPrismaClientType;

  constructor(private readonly prismaService: PrismaService) {
    this.readerClient = prismaService.readerClient;
    this.writerClient = prismaService.writerClient;
  }
  async create(data: CreateUserDto): Promise<UserWithoutPasswordDto> {
    try {
      const hashedPassword = this.hashPassword(data.password);
      const [user] = await this.writerClient.$transaction([
        this.writerClient.user.create({
          data: { ...data, password: hashedPassword },
        }),
      ]);
      return UserMapperUtil.toDtoWithoutPassword(user);
    } catch (error) {
      this.handleError(error);
    }
  }
  async findOne(id: string): Promise<UserWithoutPasswordDto> {
    try {
      const user = await this.readerClient.user.findUniqueOrThrow({
        where: { id },
      });
      return UserMapperUtil.toDtoWithoutPassword(user);
    } catch (error) {
      this.handleError(error);
    }
  }
  async findMany(
    query: FilterUserDto
  ): Promise<PaginationResponseDto<UserWithoutPasswordDto>> {
    try {
      const [users, total] = await this.readerClient.$transaction([
        this.readerClient.user.findMany({
          where: {},
          take: query.take,
          skip: query.skip,
        }),
        this.readerClient.user.count({ where: {} }),
      ]);

      const formattedUsers = UserMapperUtil.toDtos(users);

      return PaginationUtil.paginate<UserWithoutPasswordDto>(
        formattedUsers,
        total,
        query.take
      );
    } catch (error) {
      this.handleError(error);
    }
  }
  async update(
    id: string,
    data: UpdateUserDto
  ): Promise<UserWithoutPasswordDto> {
    try {
      const updateData = { ...data };
      if (updateData.password) {
        updateData.password = this.hashPassword(updateData.password);
      }

      const user = await this.writerClient.user.update({
        where: { id },
        data: updateData,
      });

      return UserMapperUtil.toDtoWithoutPassword(user);
    } catch (error) {
      this.handleError(error);
    }
  }
  async delete(id: string): Promise<UserWithoutPasswordDto> {
    try {
      const user = await this.writerClient.user.softDelete(id);
      return UserMapperUtil.toDtoWithoutPassword(user);
    } catch (error) {
      this.handleError(error);
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
      this.handleError(error);
    }
  }

  private hashPassword(password: string): string {
    return hashSync(password, 10);
  }

  private handleError(error: unknown): never {
    let errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          errorCode = HttpStatus.CONFLICT;
          message = 'Email already exists';
          break;
        case 'P2025':
          errorCode = HttpStatus.NOT_FOUND;
          message = 'User not found';
          break;
        default:
          errorCode = HttpStatus.UNPROCESSABLE_ENTITY;
          message = 'Unprocessable entity';
          break;
      }
    }
    throw new RpcException({ code: errorCode, message: message });
  }
}
