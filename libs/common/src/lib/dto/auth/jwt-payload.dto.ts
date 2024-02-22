import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Type } from 'class-transformer';

import { UserDto } from '../user/user.dto';

export class JwtPayloadDto {
  @ApiProperty()
  @IsString()
  sub!: string;

  @ApiProperty()
  @Type(() => UserDto)
  user!: Partial<UserDto>;

  @ApiProperty()
  @IsString()
  sessionId!: string;

  @ApiProperty()
  @IsString()
  iat!: number;

  @ApiProperty()
  @IsString()
  exp!: number;
}
