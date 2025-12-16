import { LoggerService } from "@nestjs/common";
import { Logger } from "winston";

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
