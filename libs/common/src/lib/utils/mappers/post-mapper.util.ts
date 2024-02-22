import { Post } from '@prisma/client';

import { PostDto } from '../../dto/post/post.dto';

export type PostWithUserName = Post & { user: { fullName: string } };

export class PostMapperUtil {
  static toDto({ user, ...post }: PostWithUserName): PostDto {
    return {
      ...post,
      username: user.fullName,
    };
  }

  static toDtos(posts: PostWithUserName[]) {
    return posts.map((post) => this.toDto(post));
  }
}
