import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  CommonModule,
  EnvironmentService,
  QueueNames,
  QueueServiceName,
} from '@social/common';

import { UserClientService } from './providers/user-client.service';
import { UserClientController } from './controllers/user-client.controller';

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
  ],
  controllers: [UserClientController],
  providers: [UserClientService],
  exports: [],
})
export class UserClientModule {}
