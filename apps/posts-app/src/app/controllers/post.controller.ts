import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePostDto,
  FilterPostDto,
  PaginationResponseDto,
  PostCommand,
  PostDto,
  PostLikeDto,
  UpdatePostDto,
} from '@social/common';

import { PostService } from '../providers/post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern(PostCommand.CREATE)
  async create(
    @Payload() data: { data: CreatePostDto; userId: string }
  ): Promise<PostDto> {
    return this.postService.create(data.data, data.userId);
  }

  @MessagePattern(PostCommand.GET)
  async findOne(@Payload() id: string): Promise<PostDto> {
    return this.postService.findOne(id);
  }

  @MessagePattern(PostCommand.GET_ALL)
  async findMany(
    @Payload() query: FilterPostDto
  ): Promise<PaginationResponseDto<PostDto>> {
    return this.postService.findMany(query);
  }

  @MessagePattern(PostCommand.UPDATE)
  async update(
    @Payload() data: { id: string; userId: string; data: UpdatePostDto }
  ): Promise<PostDto> {
    return this.postService.update(data.id, data.data, data.userId);
  }

  @MessagePattern(PostCommand.DELETE)
  async delete(
    @Payload() data: { id: string; userId: string }
  ): Promise<PostDto> {
    return this.postService.delete(data.id, data.userId);
  }

  @MessagePattern(PostCommand.LIKE)
  async like(@Payload() data: { id: string }): Promise<PostLikeDto> {
    return this.postService.like(data.id);
  }

  @MessagePattern(PostCommand.UNLIKE)
  async unlike(@Payload() data: { id: string }): Promise<PostLikeDto> {
    return this.postService.unlike(data.id);
  }
}
