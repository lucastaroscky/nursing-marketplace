import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.log(exception);

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();

      return response.status(status).json(message);
    }

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return response.status(409).json({
          statusCode: 409,
          message: 'Email already in use',
          timestamp: new Date().toISOString(),
          path: request.url,
        });
      }
    }

    return response.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
