import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class ErrorResponseDto extends BaseResponseDto {
  constructor(
    statusCode: number = 500,
    message: string = 'Internal Server Error',
    error?: string,
  ) {
    super(statusCode, message, undefined, error);
  }
}
