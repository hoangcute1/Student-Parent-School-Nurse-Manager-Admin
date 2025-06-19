import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMedicineTreatmentDto {
  @ApiProperty({
    description: 'Treatment history ID',
    example: '60d0fe4f5311236168a109ca',
    required: false,
  })
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiProperty({
    description: 'Medicine storage ID',
    example: '60d0fe4f5311236168a109cb',
    required: false,
  })
  @IsOptional()
  @IsString()
  medicine?: string;
}
