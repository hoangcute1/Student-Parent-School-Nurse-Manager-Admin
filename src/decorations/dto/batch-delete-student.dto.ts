import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BatchDeleteStudentDto {
  @ApiProperty({
    type: [String],
    description: 'Danh sách ID sinh viên cần xóa',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất một ID sinh viên' })
  @IsMongoId({ each: true, message: 'ID sinh viên không hợp lệ' })
  ids: string[];
}
