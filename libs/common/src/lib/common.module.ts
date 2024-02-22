import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from './providers/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { validate } from './env/environment.validation';
import { EnvironmentService } from './providers/environment.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validate,
    }),
  ],
  controllers: [],
  providers: [PrismaService, JwtStrategy, EnvironmentService],
  exports: [PrismaService, EnvironmentService],
})
export class CommonModule {}
