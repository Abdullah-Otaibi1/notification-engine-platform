import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let message: string;
    let details: string[] | undefined;

    if (exception instanceof HttpException) {
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const resp = exceptionResponse as Record<string, any>;
        if (Array.isArray(resp.message)) {
          details = resp.message as string[];
          message = 'Validation failed';
        } else {
          message = resp.message ?? 'An error occurred';
        }
      } else {
        message = 'An error occurred';
      }
    } else {
      message = 'Internal server error';
      this.logger.error(`Unhandled exception: ${exception}`);
    }

    response.status(status).json({
      success: false,
      error: {
        code: status.toString(),
        message,
        ...(details ? { details } : {}),
        path: request.url,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
