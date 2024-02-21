import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateUserDto,
  FilterUserDto,
  QueueServiceName,
  UpdateUserDto,
  UserCommand,
} from '@social/common';

@Injectable()
export class UserClientService {
  constructor(
    @Inject(QueueServiceName.USER_SERVICE)
    private readonly userClient: ClientProxy
  ) {}

  async create(data: CreateUserDto) {
    return this.userClient.send(UserCommand.CREATE, data);
  }

  async findOne(id: string) {
    return this.userClient.send(UserCommand.GET, id);
  }

  async findMany(query: FilterUserDto) {
    return this.userClient.send(UserCommand.GET_ALL, query);
  }

  async update(id: string, data: UpdateUserDto) {
    return this.userClient.send(UserCommand.UPDATE, { id, data });
  }

  async delete(id: string) {
    return this.userClient.send(UserCommand.DELETE, id);
  }
}
