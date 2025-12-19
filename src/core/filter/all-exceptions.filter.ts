import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
  LoggerService,
} from "@nestjs/common";
import { ERROR_MESSAGES } from "@src/common/constants/messages.constant";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly appConfigService: AppConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 상태 코드 및 에러 메시지 결정
    // HttpException이면 해당 status 사용, 그 외(시스템 에러 등)는 500 에러로 처리
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // 에러 상세 내용 추출
    let errorDetails: Record<string, any>;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      errorDetails =
        typeof exceptionResponse === "string"
          ? { message: exceptionResponse }
          : (exceptionResponse as Record<string, any>);
    } else {
      const isProduction = this.appConfigService.isProduction;
      // HttpException이 아닌 시스템 에러 (TypeError, ReferenceError 등)
      errorDetails = {
        message:
          !isProduction && exception instanceof Error
            ? exception.message
            : ERROR_MESSAGES[HttpStatus.INTERNAL_SERVER_ERROR],
        error: ERROR_MESSAGES[HttpStatus.INTERNAL_SERVER_ERROR],
      };
    }

    // 로그 레벨 처리
    // 500 이상(서버 에러)은 스택 트레이스 포함하여 Error 레벨 로깅
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const stack = exception instanceof Error ? exception.stack : "";
      this.logger.error(
        `[${request.method}] ${request.url} - ${status}`,
        stack,
        "AllExceptionsFilter",
      );
    } else {
      // 400번대 에러는 Warn 레벨로 간소화
      this.logger.warn(
        `[${request.method}] ${request.url} - ${status} - ${JSON.stringify(errorDetails)}`,
        "AllExceptionsFilter",
      );
    }

    // 프로덕션 환경에서 500 에러 상세 정보 숨김 처리
    const isProduction = this.appConfigService.isProduction;
    const responseError =
      isProduction && status >= HttpStatus.INTERNAL_SERVER_ERROR
        ? { message: ERROR_MESSAGES[HttpStatus.INTERNAL_SERVER_ERROR] }
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
