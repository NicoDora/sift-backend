import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "@src/app.module";
import { BootstrapService } from "@src/core/services/bootstrap.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const bootstrapService = app.get<BootstrapService>(BootstrapService);

  bootstrapService.setupSwagger(app);
  bootstrapService.setupPipe(app);
  bootstrapService.setupCookie(app);

  app.useLogger(app.get(Logger));

  await bootstrapService.startServer(app);
}
bootstrap();
