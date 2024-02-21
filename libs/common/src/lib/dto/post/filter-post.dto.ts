import { IsNumber } from 'class-validator';

export class FilterPostDto {
  @IsNumber()
  take!: number;

  @IsNumber()
  skip!: number;
}
