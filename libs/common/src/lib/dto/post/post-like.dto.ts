import { PickType } from '@nestjs/swagger';

import { PostDto } from './post.dto';

export class PostLikeDto extends PickType(PostDto, ['id', 'likes']) {}
