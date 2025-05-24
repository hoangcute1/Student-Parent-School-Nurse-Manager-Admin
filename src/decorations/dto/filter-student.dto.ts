import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto';

export enum FilterOperator {
  EQUALS = 'eq',
  NOT_EQUALS = 'ne',
  GREATER_THAN = 'gt',
  GREATER_THAN_OR_EQUALS = 'gte',
  LESS_THAN = 'lt',
  LESS_THAN_OR_EQUALS = 'lte',
  IN = 'in',
  NOT_IN = 'nin',
  CONTAINS = 'contains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith',
}

export class AdvancedFilter {
  @ApiProperty({ description: 'Field to filter on' })
  @IsString()
  field: string;

  @ApiProperty({ enum: FilterOperator, description: 'Filter operator' })
  @IsEnum(FilterOperator)
  operator: FilterOperator;

  @ApiProperty({ description: 'Filter value' })
  value: any;
}

export class FilterStudentDto extends PaginationDto {
  @ApiProperty({ required: false, description: 'Tìm kiếm theo tên' })
  @IsOptional()
  @IsString()
  search?: string;
  @ApiProperty({ required: false, description: 'Lọc theo mã sinh viên' })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiProperty({ required: false, description: 'Lọc theo ngày tạo từ' })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiProperty({ required: false, description: 'Lọc theo ngày tạo đến' })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiProperty({
    required: false,
    type: [AdvancedFilter],
    description: 'Bộ lọc nâng cao',
  })
  @IsOptional()
  @IsArray()
  @Type(() => AdvancedFilter)
  advancedFilters?: AdvancedFilter[];
}
