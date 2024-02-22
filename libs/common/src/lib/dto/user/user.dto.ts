import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UserDto implements User {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  fullName!: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  age!: number | null;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty()
  @IsDateString()
  createdAt!: Date;

  @ApiProperty()
  @IsDateString()
  updatedAt!: Date;

  @ApiProperty()
  @IsDateString()
  deletedAt!: Date | null;
}
