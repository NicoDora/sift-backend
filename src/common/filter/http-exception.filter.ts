import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
  Logger,
  LoggerService,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(@Inject(Logger) private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // 예외 내용 가져오기 (string 또는 object)
    const exceptionResponse = exception.getResponse();

    // 에러 메시지 표준화
    const errorDetails =
      typeof exceptionResponse === "string"
        ? { message: exceptionResponse }
        : (exceptionResponse as Record<string, any>);

    // 로그 레벨 분기 처리
    // 500 Internal Server Error인 경우만 error 레벨 + 스택 트레이스 기록
    // 그 외(4xx 등)는 warn 레벨로 기록하여 로그 노이즈 감소
    if (status >= 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        exception.stack,
        "HttpExceptionFilter",
      );
    } else {
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${JSON.stringify(errorDetails)}`,
        "HttpExceptionFilter",
      );
    }

    // 프로덕션 환경에서 500 에러 상세 정보 숨김 처리
    const isProduction = process.env.NODE_ENV === "production";
    const responseError =
      isProduction && status >= 500
        ? { message: "Internal Server Error" }
        : errorDetails;

    // 클라이언트에게 전달할 표준 응답 구조
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      statusCode: status,
      error: responseError,
    });
  }
}
