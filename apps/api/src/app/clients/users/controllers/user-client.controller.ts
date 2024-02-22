import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  AuthGuard,
  CreateUserDto,
  CurrentUser,
  FilterUserDto,
  UserDto,
} from '@social/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserClientService } from '../providers/user-client.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UserClientController {
  constructor(private readonly userClientService: UserClientService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<UserDto> {
    return this.userClientService.create(data);
  }

  @Get()
  async findMany(
    @Query() query: FilterUserDto,
    @CurrentUser() user: UserDto
  ): Promise<UserDto[]> {
    return this.userClientService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userClientService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Body() data: CreateUserDto,
    @Param('id') id: string
  ): Promise<UserDto> {
    return this.userClientService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserDto> {
    return this.userClientService.delete(id);
  }
}
