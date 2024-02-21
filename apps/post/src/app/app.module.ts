import { Module } from '@nestjs/common';
import { CommonModule } from '@social/common';

import { PostController } from './controllers/post.controller';
import { PostService } from './providers/post.service';

@Module({
  imports: [CommonModule],
  controllers: [PostController],
  providers: [PostService],
})
export class AppModule {}
