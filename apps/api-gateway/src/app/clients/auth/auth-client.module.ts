import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  QueueServiceName,
  QueueNames,
  EnvironmentService,
  CommonModule,
} from '@social/common';

import { AuthClientController } from './controllers/auth-client.controller';
import { AuthClientService } from './providers/auth-client.service';

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
  ],
  controllers: [AuthClientController],
  providers: [AuthClientService],
  exports: [],
})
export class AuthClientModule {}
