import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateParentStudentDto {
  @ApiProperty({
    description: 'Parent ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  parent: string;

  @ApiProperty({
    description: 'Student ID',
    example: '60d0fe4f5311236168a109cb',
  })
  @IsNotEmpty()
  @IsString()
  student: string;
}
