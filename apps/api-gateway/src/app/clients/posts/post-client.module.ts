import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueNames, QueueServiceName } from '@social/common';

import { PostClientService } from './providers/post-client.service';
import { PostClientController } from './controllers/post-client.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: QueueServiceName.AUTH_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@127.0.0.1:5672/vhost'],
          queue: QueueNames.AUTH,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: QueueServiceName.POST_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@127.0.0.1:5672/vhost'],
          queue: QueueNames.POSTS,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [PostClientController],
  providers: [PostClientService],
  exports: [],
})
export class PostClientModule {}
