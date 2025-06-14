import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateMedicineTreatmentDto {
  @ApiProperty({
    description: 'Treatment history ID',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  @IsString()
  treatment: string;

  @ApiProperty({
    description: 'Medicine storage ID',
    example: '60d0fe4f5311236168a109cb',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicine?: string;
}
