import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "@src/app.controller";
import { AppService } from "@src/app.service";
import { winstonLogger } from "@src/common/logger/winston.config";
import { WinstonLogger } from "@src/common/logger/winston.logger";
import { LoggerMiddleware } from "@src/common/middleware/logger.middleware";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env"],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: Logger,
      useFactory: () => new WinstonLogger(winstonLogger),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
