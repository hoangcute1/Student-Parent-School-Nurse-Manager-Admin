import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateStudentDto } from './create-student.dto';

export class BatchCreateStudentDto {
  @ApiProperty({
    type: [CreateStudentDto],
    description: 'Danh sách sinh viên cần tạo',
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Cần ít nhất một sinh viên' })
  @ValidateNested({ each: true })
  @Type(() => CreateStudentDto)
  students: CreateStudentDto[];
}
