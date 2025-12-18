import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { RESPONSE_MESSAGE_KEY } from "../decorators/response-message.decorator";

export interface ApiSuccessResponse<T> {
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const response = httpContext.getResponse();
        const statusCode = response.statusCode;

        // 데코레이터로 설정된 메시지가 있으면 가져오고, 없으면 기본값 사용
        const message =
          this.reflector.getAllAndOverride<string>(RESPONSE_MESSAGE_KEY, [
            context.getHandler(),
            context.getClass(),
          ]) || "요청이 성공적으로 처리되었습니다.";

        return {
          statusCode,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
          data, // 실제 비즈니스 로직의 리턴값
        };
      }),
    );
  }
}
