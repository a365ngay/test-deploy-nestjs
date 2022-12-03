import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApmService } from './apm.service';

@Injectable()
export class ApmInterceptor implements NestInterceptor {
  constructor(private readonly apmService: ApmService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const [incomingMessage, ...res] = context.getArgs();
    const { method, originalUrl } = incomingMessage;
    const name = `${method} ${originalUrl}`;

    this.apmService.startTransaction(name);
    return next.handle().pipe(
      tap(() => this.apmService.endTransaction(`${name} ends in status code 2xx.`)),
      catchError((err: Error) => {
        this.apmService.captureError(err);
        return throwError(err);
      }),
    );
  }
}
