import { PaginationResponseDto } from '../dto/common/pagination-response.dto';

export class PaginationUtil {
  static paginate<T>(
    data: T[],
    total: number,
    limit: number
  ): PaginationResponseDto<T> {
    return {
      data: data,
      totalPages: Math.ceil(total / limit),
    };
  }
}
