import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class PostDto implements Partial<Post> {
  @ApiProperty()
  @IsString()
  id!: string;

  @ApiProperty()
  @IsString()
  title!: string;

  @ApiProperty()
  @IsString()
  content!: string;

  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  likes!: number;

  @ApiProperty()
  @IsString()
  username!: string;

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
