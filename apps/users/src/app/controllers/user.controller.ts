import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateUserDto,
  FilterUserDto,
  LoginDto,
  UpdateUserDto,
  UserCommand,
} from '@social/common';

import { UserService } from '../providers/user.service';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserCommand.CREATE)
  async create(@Payload() data: CreateUserDto) {
    return this.userService.create(data);
  }

  @MessagePattern(UserCommand.GET)
  async findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserCommand.GET_ALL)
  async findMany(@Payload() query: FilterUserDto) {
    const users = await this.userService.findMany(query);

    return users;
  }

  @MessagePattern(UserCommand.UPDATE)
  async update(@Payload() data: { id: string; data: UpdateUserDto }) {
    return this.userService.update(data.id, data.data);
  }

  @MessagePattern(UserCommand.DELETE)
  async delete(@Payload() id: string) {
    return this.userService.delete(id);
  }

  @MessagePattern(UserCommand.VALIDATE)
  async validate(@Payload() data: LoginDto) {
    return this.userService.validate(data);
  }
}
