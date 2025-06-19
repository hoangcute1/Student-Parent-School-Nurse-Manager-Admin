import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateClassDto {
  @ApiProperty({ example: '10A1', description: 'Tên lớp học' })
  @IsString()
  name: string;

  @ApiProperty({ example: '10', description: 'Khối lớp' })
  @IsString()
  grade: string;
}
