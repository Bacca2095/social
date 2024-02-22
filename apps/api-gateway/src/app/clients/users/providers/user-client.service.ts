import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  FilterUserDto,
  PaginationResponseDto,
  QueueServiceName,
  UpdateUserDto,
  UserCommand,
  UserWithoutPasswordDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(QueueServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy
  ) {}

  async create(data: CreateUserDto): Promise<UserWithoutPasswordDto> {
    return lastValueFrom(this.userClient.send(UserCommand.CREATE, data));
  }

  async findOne(id: string): Promise<UserWithoutPasswordDto> {
    return lastValueFrom(this.userClient.send(UserCommand.GET, id));
  }

  async findMany(
    query: FilterUserDto
  ): Promise<PaginationResponseDto<UserWithoutPasswordDto>> {
    return lastValueFrom(this.userClient.send(UserCommand.GET_ALL, query));
  }

  async update(
    id: string,
    data: UpdateUserDto
  ): Promise<UserWithoutPasswordDto> {
    return lastValueFrom(
      this.userClient.send(UserCommand.UPDATE, { id, data })
    );
  }

  async delete(id: string): Promise<UserWithoutPasswordDto> {
    return lastValueFrom(this.userClient.send(UserCommand.DELETE, id));
  }
}
