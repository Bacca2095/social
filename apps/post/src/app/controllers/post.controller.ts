import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreatePostDto,
  FilterPostDto,
  PostCommand,
  UpdatePostDto,
} from '@social/common';

import { PostService } from '../providers/post.service';

@Controller()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @MessagePattern(PostCommand.CREATE)
  async create(@Payload() data: CreatePostDto) {
    return this.postService.create(data);
  }

  @MessagePattern(PostCommand.GET)
  async findOne(@Payload() id: string) {
    return this.postService.findOne(id);
  }

  @MessagePattern(PostCommand.GET_ALL)
  async findMany(@Payload() query: FilterPostDto) {
    return this.postService.findMany(query);
  }

  @MessagePattern(PostCommand.UPDATE)
  async update(@Payload() data: { id: string; data: UpdatePostDto }) {
    return this.postService.update(data.id, data.data);
  }

  @MessagePattern(PostCommand.DELETE)
  async delete(@Payload() id: string) {
    return this.postService.delete(id);
  }
}
