import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class FilterUserDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  take?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  skip?: number;
}
