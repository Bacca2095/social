import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Array of data items' })
  data!: T[];

  @ApiProperty({
    example: 10,
    description: 'Total number of pages',
    type: Number,
  })
  totalPages!: number;
}
