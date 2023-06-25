import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { Observable, tap } from 'rxjs';

@Injectable()
export class MqttLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MqttLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToRpc().getContext() as MqttContext;
    this.logger.log(`${ctx.getTopic()} message dispatched`);

    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const time = `+${Date.now() - start}ms`;
        this.logger.log(`${ctx.getTopic()} ${time} handled`);
      }),
    );
  }
}
