import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueNames, QueueServiceName } from '@social/common';

import { UserClientService } from './providers/user-client.service';
import { UserClientController } from './controllers/user-client.controller';

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
        name: QueueServiceName.USER_SERVICE,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@127.0.0.1:5672/vhost'],
          queue: QueueNames.USERS,
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [UserClientController],
  providers: [UserClientService],
  exports: [],
})
export class UserClientModule {}
