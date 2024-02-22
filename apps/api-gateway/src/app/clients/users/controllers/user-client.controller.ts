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
  ApiPaginatedResponse,
  AuthGuard,
  CreateUserDto,
  FilterUserDto,
  PaginationResponseDto,
  UserWithoutPasswordDto,
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
  async create(@Body() data: CreateUserDto): Promise<UserWithoutPasswordDto> {
    return this.userClientService.create(data);
  }

  @Get()
  @ApiPaginatedResponse(UserWithoutPasswordDto)
  async findMany(
    @Query() query: FilterUserDto
  ): Promise<PaginationResponseDto<UserWithoutPasswordDto>> {
    return this.userClientService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserWithoutPasswordDto> {
    return this.userClientService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Body() data: CreateUserDto,
    @Param('id') id: string
  ): Promise<UserWithoutPasswordDto> {
    return this.userClientService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<UserWithoutPasswordDto> {
    return this.userClientService.delete(id);
  }
}
