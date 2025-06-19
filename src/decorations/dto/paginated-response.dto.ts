import { ApiProperty } from '@nestjs/swagger';
import { SuccessResponseDto } from './success-response.dto';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number', example: 1 })
  page: number;

  @ApiProperty({ description: 'Number of items per page', example: 10 })
  limit: number;

  @ApiProperty({ description: 'Total number of items', example: 100 })
  totalItems: number;

  @ApiProperty({ description: 'Total number of pages', example: 10 })
  totalPages: number;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNextPage: boolean;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> extends SuccessResponseDto<{
  items: T[];
  meta: PaginationMeta;
}> {
  constructor(
    items: T[],
    meta: PaginationMeta,
    message: string = 'Data retrieved successfully',
  ) {
    super(message, {
      items,
      meta,
    });
  }
}
