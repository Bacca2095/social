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
  CreatePostDto,
  FilterPostDto,
  UpdatePostDto,
} from '@social/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { PostClientService } from '../providers/post-client.service';

@ApiTags('Posts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PostClientController {
  constructor(private readonly postClientService: PostClientService) {}

  @Post()
  async create(@Body() data: CreatePostDto) {
    return this.postClientService.create(data);
  }

  @Get()
  async findMany(@Query() query: FilterPostDto) {
    return this.postClientService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postClientService.findOne(id);
  }

  @Patch(':id')
  async update(@Body() data: UpdatePostDto, @Param('id') id: string) {
    return this.postClientService.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.postClientService.delete(id);
  }
}
