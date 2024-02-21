import { OmitType } from '@nestjs/swagger';

import { PostDto } from './post.dto';

export class CreatePostDto extends OmitType(PostDto, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'likes',
  'username',
]) {}
