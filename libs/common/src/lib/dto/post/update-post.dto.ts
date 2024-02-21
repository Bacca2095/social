import { OmitType, PartialType } from '@nestjs/swagger';

import { PostDto } from './post.dto';

export class UpdatePostDto extends PartialType(
  OmitType(PostDto, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'username'])
) {}
