import { ApiProperty } from '@nestjs/swagger';
import { Session } from '@prisma/client';
import { IsUUID, IsDateString, IsString } from 'class-validator';

export class SessionDto implements Session {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsDateString()
  createdAt!: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt!: Date;

  @ApiProperty()
  @IsUUID()
  userId!: string;

  @ApiProperty()
  @IsDateString()
  deletedAt!: Date | null;
}
