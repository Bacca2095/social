import { Module } from '@nestjs/common';
import { CommonModule } from '@social/common';

import { UserController } from './controllers/user.controller';
import { UserService } from './providers/user.service';

@Module({
  imports: [CommonModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
