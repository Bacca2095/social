import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  @Min(1)
  take?: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsOptional()
  @IsNumber()
  @Min(0)
  skip?: number;
}
