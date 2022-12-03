import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (process.env.NODE_ENV === 'test') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest<Request>();
    const { method, ip, url, body, query, params } = request;
    const args = { ...body, ...query, ...params };
    const now = Date.now();
    const timestamp = new Date().toISOString();

    Logger.log(`info ${timestamp} ip: ${ip} method: ${method} url: ${url}`);
    Object.keys(args).forEach(k => Logger.log(`info ${timestamp} ${k}: ${JSON.stringify(args[k])}`));

    return next.handle().pipe(
      tap(value => Logger.log(`Response:', ${JSON.stringify(value)}`)),
      finalize(() => {
        Logger.log(`Excution time... ${Date.now() - now}ms`);
      }),
    );
  }
}
