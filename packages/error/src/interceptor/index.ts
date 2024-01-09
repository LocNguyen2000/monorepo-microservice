import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { url, method } = context.switchToHttp().getRequest<Request>();

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`{ ${url}, ${method} } : ${Date.now() - now}ms`)
        )
      );
  }
}
