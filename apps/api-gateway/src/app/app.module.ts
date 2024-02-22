import { Module } from '@nestjs/common';

import { AuthClientModule } from './clients/auth/auth-client.module';
import { UserClientModule } from './clients/users/user-client.module';
import { PostClientModule } from './clients/posts/post-client.module';

@Module({
  imports: [AuthClientModule, UserClientModule, PostClientModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
