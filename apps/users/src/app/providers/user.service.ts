import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
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
    const hashedPassword = hashSync(data.password, 10);
    return this.writerClient.user.create({
      data: { ...data, password: hashedPassword },
    });
  }
  async findOne(id: string) {
    return this.readerClient.user.findUnique({ where: { id } });
  }
  async findMany(query: FilterUserDto) {
    try {
      return this.readerClient.user.findMany({
        where: {},
        take: query.take,
        skip: query.skip,
      });
    } catch (error) {
      console.log(error);
    }
  }
  async update(id: string, data: UpdateUserDto) {
    return this.writerClient.user.update({ where: { id }, data });
  }
  async delete(id: string) {
    return this.writerClient.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async validate(data: LoginDto): Promise<UserDto> {
    try {
      const result = await this.readerClient.user.findUniqueOrThrow({
        where: { email: data.email },
      });

      const match = compareSync(data.password, result.password);

      if (!match) {
        throw new BadRequestException('Incorrect email or password');
      }

      return result;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}
