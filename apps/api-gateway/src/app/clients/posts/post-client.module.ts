import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CommonModule,
  EnvironmentService,
  QueueNames,
  QueueServiceName,
} from '@social/common';

import { PostClientService } from './providers/post-client.service';
import { PostClientController } from './controllers/post-client.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: QueueServiceName.AUTH_SERVICE,
        imports: [CommonModule],

        useFactory: async (envService: EnvironmentService) => ({
          transport: Transport.RMQ,
          options: {
            queue: QueueNames.AUTH,
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
        name: QueueServiceName.POST_SERVICE,
        imports: [CommonModule],

        useFactory: async (envService: EnvironmentService) => ({
          transport: Transport.RMQ,
          options: {
            queue: QueueNames.POSTS,
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
  controllers: [PostClientController],
  providers: [PostClientService],
  exports: [],
})
export class PostClientModule {}
