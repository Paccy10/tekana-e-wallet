import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Response } from '../interfaces';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor(@Inject(Reflector) private reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<Response<T>> | Promise<Observable<Response<T>>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message:
          this.reflector.get<string>('responseMessage', context.getHandler()) ||
          '',
        data: data || null,
      })),
    );
  }
}
