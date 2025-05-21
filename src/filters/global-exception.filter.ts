import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Lỗi hệ thống không xác định';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      // Handle NestJS HTTP exceptions
      status = exception.getStatus();
      const errorResponse = exception.getResponse();

      if (typeof errorResponse === 'object') {
        message = (errorResponse as any).message || message;
        error = (errorResponse as any).error || 'Error';
      } else {
        message = errorResponse as string;
      }
    } else if (exception instanceof MongoError) {
      // Handle MongoDB errors
      if (exception.code === 11000) {
        status = HttpStatus.CONFLICT;
        message = 'Dữ liệu đã tồn tại';
        error = 'Conflict';
      }
    } else if (exception instanceof Error) {
      // Handle generic errors
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
