import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { QueueNames } from '@social/common';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const logger = new Logger('UserMicroservice');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@127.0.0.1:5672/vhost'],
      queue: QueueNames.USERS,
      queueOptions: {
        durable: true,
      },
    },
    bufferLogs: true,
  });

  app.useLogger(logger);

  app.listen();
  logger.log(`🚀 User microservice is up and running ...`);
}

bootstrap();
