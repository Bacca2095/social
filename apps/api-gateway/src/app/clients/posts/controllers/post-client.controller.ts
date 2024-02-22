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
  CreatePostDto,
  CurrentUser,
  FilterPostDto,
  PaginationResponseDto,
  PostDto,
  PostLikeDto,
  UpdatePostDto,
  UserDto,
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
  async create(
    @Body() data: CreatePostDto,
    @CurrentUser() user: UserDto
  ): Promise<PostDto> {
    return this.postClientService.create(data, user.id);
  }

  @Get()
  @ApiPaginatedResponse(PostDto)
  async findMany(
    @Query() query: FilterPostDto
  ): Promise<PaginationResponseDto<PostDto>> {
    return this.postClientService.findMany(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostDto> {
    return this.postClientService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Body() data: UpdatePostDto,
    @Param('id') id: string,
    @CurrentUser() user: UserDto
  ): Promise<PostDto> {
    return this.postClientService.update(id, data, user.id);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: UserDto
  ): Promise<PostDto> {
    return this.postClientService.delete(id, user.id);
  }

  @Post(':id/like')
  async like(@Param('id') id: string): Promise<PostLikeDto> {
    return this.postClientService.like(id);
  }

  @Delete(':id/unlike')
  async unlike(@Param('id') id: string): Promise<PostLikeDto> {
    return this.postClientService.unlike(id);
  }
}
