import { LoggerService } from "@nestjs/common";
import { Logger } from "winston";

/**
 * NestJS의 LoggerService 인터페이스를 Winston 로거로 구현한 어댑터 클래스입니다.
 * 서비스 전반에서 일관된 로깅 처리를 위해 사용됩니다.
 */
export class WinstonLogger implements LoggerService {
  private context?: string;
  private readonly logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    const ctx = context || this.context;
    this.logger.info(message, { context: ctx });
  }

  error(message: any, trace?: string, context?: string) {
    const ctx = context || this.context;
    this.logger.error(message, { context: ctx, trace });
  }

  warn(message: any, context?: string) {
    const ctx = context || this.context;
    this.logger.warn(message, { context: ctx });
  }

  debug(message: any, context?: string) {
    const ctx = context || this.context;
    this.logger.debug(message, { context: ctx });
  }

  verbose(message: any, context?: string) {
    const ctx = context || this.context;
    this.logger.verbose(message, { context: ctx });
  }
}
