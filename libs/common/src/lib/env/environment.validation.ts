import { Transform, plainToClass } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString({ message: 'Invalid DATABASE_WRITER_URL' })
  @IsNotEmpty({ message: 'DATABASE_WRITER_URL is required' })
  DATABASE_WRITER_URL!: string;

  @IsString({ message: 'Invalid DATABASE_READER_URL' })
  @IsNotEmpty({ message: 'DATABASE_READER_URL is required' })
  DATABASE_READER_URL!: string;

  @IsString({ message: 'Invalid MAIL_SECRET_TOKEN' })
  @IsNotEmpty({ message: 'MAIL_SECRET_TOKEN is required' })
  MAIL_SECRET_TOKEN!: string;

  @IsString({ message: 'Invalid MAIL_API_TOKEN' })
  @IsNotEmpty({ message: 'MAIL_API_TOKEN is required' })
  MAIL_API_TOKEN!: string;

  @IsString({ message: 'Invalid MAIL_DEFAULT_SENDER' })
  @IsNotEmpty({ message: 'MAIL_DEFAULT_SENDER is required' })
  MAIL_DEFAULT_SENDER!: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber({}, { message: 'Invalid APP_PORT' })
  APP_PORT!: number;

  @IsString({ message: 'Invalid RABBITMQ_URL' })
  @IsNotEmpty({ message: 'RABBITMQ_URL is required' })
  RABBITMQ_URL!: string;
}

export const validate = (config: Record<string, unknown>) => {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};
