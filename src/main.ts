import { NestFactory } from "@nestjs/core";
import { AppModule } from "@src/app.module";
import { winstonLogger } from "@src/common/logger/winston.config";
import { WinstonLogger } from "@src/common/logger/winston.logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new WinstonLogger(winstonLogger),
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
