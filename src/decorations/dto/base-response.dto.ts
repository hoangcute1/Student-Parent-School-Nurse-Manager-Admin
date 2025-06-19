import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T = any> {
  @ApiProperty({ description: 'Status code of the response', example: 200 })
  statusCode: number;

  @ApiProperty({
    description: 'Message describing the response',
    example: 'Success',
  })
  message: string;

  @ApiProperty({ description: 'Data returned in the response' })
  data?: T;

  @ApiProperty({ description: 'Error details if any', required: false })
  error?: string;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: '2025-06-14T12:00:00.000Z',
  })
  timestamp: string;

  constructor(statusCode: number, message: string, data?: T, error?: string) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}
