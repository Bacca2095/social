import { IsString, IsNotEmpty } from 'class-validator';

export class SendEmailNewUserDto {
  @IsString()
  @IsNotEmpty()
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  readonly fullName!: string;
}
