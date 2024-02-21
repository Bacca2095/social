import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreatePostDto,
  FilterPostDto,
  PostCommand,
  QueueServiceName,
  UpdatePostDto,
} from '@social/common';

@Injectable()
export class PostClientService {
  constructor(
    @Inject(QueueServiceName.POST_SERVICE)
    private readonly postClient: ClientProxy
  ) {}

  async create(data: CreatePostDto) {
    return this.postClient.send(PostCommand.CREATE, data);
  }

  async findOne(id: string) {
    return this.postClient.send(PostCommand.GET, id);
  }

  async findMany(query: FilterPostDto) {
    return this.postClient.send(PostCommand.GET_ALL, query);
  }

  async update(id: string, data: UpdatePostDto) {
    return this.postClient.send(PostCommand.UPDATE, { id, data });
  }

  async delete(id: string) {
    return this.postClient.send(PostCommand.DELETE, id);
  }
}
