import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private static extractError(exception: HttpException) {
    const errorResponse = exception.getResponse();
    if (typeof errorResponse === 'string') {
      return { message: errorResponse, error: errorResponse };
    }

    const e = errorResponse as { error: string; message: string };
    const message = (e && e.message) || 'Unknown message';
    const error = (e && e.error) || 'Unknown error';
    return { message, error };
  }

  private static getFlattenMessages(httpErrorMessage: string | any[]) {
    let message: string[] = [];

    if (Array.isArray(httpErrorMessage)) {
      const nestedMessages = httpErrorMessage.map(m => {
        const constraints = m.constraints || {};
        return Object.keys(constraints).reduce((acc, k) => acc.concat(constraints[k]), []);
      });
      message = nestedMessages.reduce((acc, m) => acc.concat(...m), []);
    } else {
      message = [httpErrorMessage];
    }
    return message;
  }

  private static logMessages(
    httpErrorMessage: string | any[],
    timestamp: string,
    request: Request,
    statusCode: number,
    error: string,
    message: string[],
  ) {
    if (Array.isArray(httpErrorMessage)) {
      Logger.error('Http error message:');
      Logger.error(httpErrorMessage);
    } else {
      Logger.error(`Http error message: ${httpErrorMessage}`);
    }

    const errLog = `error ${timestamp} method: ${request.method}, path: ${
      request.url
    }, statusCode: ${statusCode}, error: ${error}, message: ${JSON.stringify(message)}`;
    Logger.error(errLog);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const errMessage = exception instanceof Error ? (exception as Error).message : '';
    const { message: httpErrorMessage, error } =
      exception instanceof HttpException
        ? AllExceptionFilter.extractError(exception)
        : { message: errMessage, error: errMessage };

    // special handle class-validator message
    const message = AllExceptionFilter.getFlattenMessages(httpErrorMessage);
    if (process.env.NODE_ENV !== 'test') {
      AllExceptionFilter.logMessages(httpErrorMessage, timestamp, request, statusCode, error, message);
    }

    response.status(statusCode).json({
      timestamp,
      statusCode,
      error,
      message,
      path: request.url,
    });
  }
}
