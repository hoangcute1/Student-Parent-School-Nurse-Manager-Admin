import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from './base-response.dto';

export class SuccessResponseDto<T = any> extends BaseResponseDto<T> {
  constructor(message: string = 'Success', data?: T) {
    super(200, message, data);
  }
}
