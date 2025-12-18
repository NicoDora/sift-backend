import { Global, Logger, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { HttpExceptionFilter } from "@src/core/filter/http-exception.filter";
import { ResponseInterceptor } from "@src/core/interceptors/response.interceptor";
import { winstonLogger } from "@src/core/logger/winston.config";
import { WinstonLogger } from "@src/core/logger/winston.logger";
import { BootstrapService } from "@src/core/services/bootstrap.service";

@Global()
@Module({
  providers: [
    BootstrapService,
    {
      provide: Logger,
      useFactory: () => new WinstonLogger(winstonLogger),
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [Logger, BootstrapService],
})
export class CoreModule {}
