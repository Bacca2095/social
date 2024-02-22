import { Injectable } from '@nestjs/common';

@Injectable()
export class EnvironmentService {
  public get environment() {
    const env = process.env;

    return {
      APP_PORT: env['APP_PORT'],
      DATABASE_READER_URL: env['DATABASE_READER_URL'],
      DATABASE_WRITER_URL: env['DATABASE_WRITER_URL'],
      MAIL_SECRET_TOKEN: env['MAIL_SECRET_TOKEN'],
      MAIL_API_TOKEN: env['MAIL_API_TOKEN'],
      MAIL_DEFAULT_SENDER: env['MAIL_DEFAULT_SENDER'],
      RABBITMQ_URL: env['RABBITMQ_URL'],
    };
  }
}
