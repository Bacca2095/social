import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

interface CustomError {
  code: string;
  message: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const path = ctx.getRequest().url;
    const timestamp = new Date().toISOString();
    let message: string | string[] = 'Internal Server Error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = this.getErrorMessage(exception);
    }

    if (this.isCustomError(exception)) {
      const error = exception as CustomError;
      statusCode = error.code as unknown as number;
      message = error.message;
    }

    response.status(statusCode).json({
      path,
      statusCode,
      message,
      timestamp,
    });
  }

  private isCustomError(error: unknown): boolean {
    return (error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error) as boolean;
  }

  private getErrorMessage(exception: HttpException): string | string[] {
    const response = exception.getResponse();
    if (typeof response === 'object' && 'message' in response) {
      return (response as { message: string | string[] }).message;
    } else {
      return response as string;
    }
  }
}
