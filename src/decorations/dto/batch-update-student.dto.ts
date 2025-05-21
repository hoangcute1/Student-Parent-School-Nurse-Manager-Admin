import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateStudentDto } from './update-student.dto';

class StudentUpdateItem {
  @ApiProperty({ description: 'ID của sinh viên cần cập nhật' })
  @IsMongoId({ message: 'ID sinh viên không hợp lệ' })
  id: string;

  @ApiProperty({ type: UpdateStudentDto, description: 'Dữ liệu cập nhật' })
  @ValidateNested()
  @Type(() => UpdateStudentDto)
  data: UpdateStudentDto;
}

export class BatchUpdateStudentDto {
  @ApiProperty({
    type: [StudentUpdateItem],
    description: 'Danh sách sinh viên cần cập nhật',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất một sinh viên' })
  @ValidateNested({ each: true })
  @Type(() => StudentUpdateItem)
  updates: StudentUpdateItem[];
}
