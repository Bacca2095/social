import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationResponseDto } from '../dto/common/pagination-response.dto';
import { PostDto } from '../dto/post/post.dto';
import { UserDto } from '../dto/user/user.dto';
import { UserWithoutPasswordDto } from '../dto/user/user-without-password.dto';

export function ApiPaginatedResponse<T extends Type<unknown>>(model: T) {
  return applyDecorators(
    ApiOkResponse({
      description: 'Paginated response',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponseDto<T>) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
              totalPages: {
                type: 'number',
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(
      PostDto,
      UserDto,
      UserWithoutPasswordDto,
      PaginationResponseDto
    )
  );
}
