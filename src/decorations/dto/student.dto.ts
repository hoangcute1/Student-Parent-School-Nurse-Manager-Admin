import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsMongoId,
  IsDateString,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female'
}

export class StudentDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'SV011' })
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsDateString()
  birth: string;

  @ApiProperty({ enum: Gender, example: 'male' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: '2A' })
  @IsString()
  @IsNotEmpty()
  class: string;

  @ApiProperty({ example: 'parent@example.com' })
  @IsEmail()
  parentEmail: string;
}