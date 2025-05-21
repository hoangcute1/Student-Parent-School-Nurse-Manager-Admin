import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'editor', description: 'Tên vai trò' })
  @IsNotEmpty({ message: 'Tên vai trò không được để trống' })
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  @MinLength(2, { message: 'Tên vai trò phải có ít nhất 2 ký tự' })
  @MaxLength(50, { message: 'Tên vai trò không được quá 50 ký tự' })
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'Tên vai trò chỉ cho phép chữ thường, số, gạch ngang và gạch dưới',
  })
  name: string;

  @ApiProperty({
    example: 'Người biên tập nội dung',
    description: 'Mô tả về vai trò',
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @ApiProperty({
    example: ['edit_content', 'publish_content'],
    description: 'Danh sách các quyền của vai trò',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Danh sách quyền phải là mảng' })
  @IsString({ each: true, message: 'Mỗi quyền phải là chuỗi' })
  permissions?: string[];
}
