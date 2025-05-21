import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    example: 'editor-updated',
    description: 'Tên vai trò',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Tên vai trò phải là chuỗi' })
  name?: string;

  @ApiProperty({
    example: 'Mô tả đã cập nhật',
    description: 'Mô tả về vai trò',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi' })
  description?: string;

  @ApiProperty({
    example: ['edit_content', 'publish_content', 'delete_content'],
    description: 'Danh sách các quyền của vai trò',
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Danh sách quyền phải là mảng' })
  @IsString({ each: true, message: 'Mỗi quyền phải là chuỗi' })
  permissions?: string[];
}
