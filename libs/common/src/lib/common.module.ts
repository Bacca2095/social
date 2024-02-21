import { Module } from '@nestjs/common';

import { PrismaService } from './providers/prisma.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, JwtStrategy],
  exports: [PrismaService],
})
export class CommonModule {}
