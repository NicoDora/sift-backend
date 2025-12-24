import { Global, Logger, Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { PrismaModule } from "@src/core/database/prisma/prisma.module";
import { AllExceptionsFilter } from "@src/core/filter/all-exceptions.filter";
import { ResponseInterceptor } from "@src/core/interceptors/response.interceptor";
import { createWinstonLogger } from "@src/core/logger/winston.config";
import { WinstonLogger } from "@src/core/logger/winston.logger";
import { BootstrapService } from "@src/core/services/bootstrap.service";

@Global()
@Module({
  imports: [PrismaModule],
  providers: [
    AppConfigService,
    BootstrapService,
    {
      provide: Logger,
      inject: [AppConfigService],
      useFactory: (appConfig: AppConfigService) => {
        const loggerInstance = createWinstonLogger(appConfig);
        return new WinstonLogger(loggerInstance);
      },
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [AppConfigService, Logger, BootstrapService],
})
export class CoreModule {}
