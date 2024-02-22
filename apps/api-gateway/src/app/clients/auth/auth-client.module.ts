import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QueueServiceName, QueueNames } from '@social/common';

import { AuthClientController } from './controllers/auth-client.controller';
import { AuthClientService } from './providers/auth-client.service';

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
  ],
  controllers: [AuthClientController],
  providers: [AuthClientService],
  exports: [],
})
export class AuthClientModule {}
