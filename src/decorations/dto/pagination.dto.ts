import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsInt,
  Min,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SortField {
  @ApiProperty({ description: 'Field to sort by' })
  @IsString()
  field: string;

  @ApiProperty({ enum: SortOrder, description: 'Sort direction' })
  @IsEnum(SortOrder)
  order: SortOrder;
}

export class PaginationDto {
  @ApiProperty({ required: false, default: 1, description: 'Trang hiện tại' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Trang phải là số nguyên' })
  @Min(1, { message: 'Trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiProperty({
    required: false,
    default: 10,
    description: 'Số lượng bản ghi trên mỗi trang',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Kích thước trang phải là số nguyên' })
  @Min(1, { message: 'Kích thước trang phải lớn hơn hoặc bằng 1' })
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: 'Sắp xếp theo trường (deprecated, use sortFields instead)',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    required: false,
    enum: SortOrder,
    default: SortOrder.ASC,
    description: 'Thứ tự sắp xếp (deprecated, use sortFields instead)',
  })
  @IsOptional()
  @IsEnum(SortOrder, { message: 'Thứ tự sắp xếp phải là "asc" hoặc "desc"' })
  sortOrder?: SortOrder = SortOrder.ASC;

  @ApiProperty({
    required: false,
    type: [SortField],
    description: 'Multiple sort fields with directions',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SortField)
  sortFields?: SortField[];
}
