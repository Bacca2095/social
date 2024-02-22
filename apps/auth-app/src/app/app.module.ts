import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  QueueServiceName,
  QueueNames,
  JwtStrategy,
  PrismaService,
  EnvironmentService,
  CommonModule,
} from '@social/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './providers/auth.service';
import { SessionService } from './providers/session.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    ClientsModule.registerAsync([
      {
        name: QueueServiceName.USER_SERVICE,
        imports: [CommonModule],

        useFactory: async (envService: EnvironmentService) => ({
          transport: Transport.RMQ,
          options: {
            queue: QueueNames.USERS,
            urls: [envService.environment.RABBITMQ_URL],
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [EnvironmentService],
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: QueueServiceName.MAIL_SERVICE,
        imports: [CommonModule],

        useFactory: async (envService: EnvironmentService) => ({
          transport: Transport.RMQ,
          options: {
            queue: QueueNames.MAIL,
            urls: [envService.environment.RABBITMQ_URL],
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [EnvironmentService],
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionService, PrismaService],
})
export class AppModule {}
