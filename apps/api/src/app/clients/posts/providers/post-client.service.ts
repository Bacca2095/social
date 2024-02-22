import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreatePostDto,
  FilterPostDto,
  PaginationResponseDto,
  PostCommand,
  PostDto,
  PostLikeDto,
  QueueServiceName,
  UpdatePostDto,
} from '@social/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PostClientService {
  constructor(
    @Inject(QueueServiceName.POST_SERVICE)
    private readonly postClient: ClientProxy
  ) {}

  async create(data: CreatePostDto, userId: string): Promise<PostDto> {
    return lastValueFrom(
      this.postClient.send(PostCommand.CREATE, { data, userId })
    );
  }

  async findOne(id: string): Promise<PostDto> {
    return lastValueFrom(this.postClient.send(PostCommand.GET, id));
  }

  async findMany(
    query: FilterPostDto
  ): Promise<PaginationResponseDto<PostDto>> {
    return lastValueFrom(this.postClient.send(PostCommand.GET_ALL, query));
  }

  async update(
    id: string,
    data: UpdatePostDto,
    userId: string
  ): Promise<PostDto> {
    return lastValueFrom(
      this.postClient.send(PostCommand.UPDATE, { id, data, userId })
    );
  }

  async delete(id: string, userId: string): Promise<PostDto> {
    return lastValueFrom(
      this.postClient.send(PostCommand.DELETE, { id, userId })
    );
  }

  async like(id: string): Promise<PostLikeDto> {
    return lastValueFrom(this.postClient.send(PostCommand.LIKE, { id }));
  }

  async unlike(id: string): Promise<PostLikeDto> {
    return lastValueFrom(this.postClient.send(PostCommand.UNLIKE, { id }));
  }
}
