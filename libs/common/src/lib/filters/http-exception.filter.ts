import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message =
        typeof exception.getResponse() === 'object'
          ? (exception.getResponse() as { message: string | string[] }).message
          : exception.getResponse();
      response.status(status).json({
        path: ctx.getRequest().url,
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        path: ctx.getRequest().url,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
