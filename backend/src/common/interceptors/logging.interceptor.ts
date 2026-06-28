import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = context.switchToHttp().getResponse();
        const elapsed = Date.now() - start;
        this.logger.log(`${method} ${url} ${res.statusCode} ${elapsed}ms - ${ip}`);
      }),
      catchError((err) => {
        const elapsed = Date.now() - start;
        const status = err?.status ?? 500;
        this.logger.error(`${method} ${url} ${status} ${elapsed}ms - ${ip} ${userAgent}`);
        return throwError(() => err);
      }),
    );
  }
}
