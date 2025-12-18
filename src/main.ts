import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@src/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(Logger));

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle("Sift API")
    .setDescription("Sift 백엔드 API 문서입니다.")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-docs", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      targetSorter: "alpha",
      operationsSorter: (a: Map<any, any>, b: Map<any, any>) => {
        const methodsOrder = {
          post: "0",
          get: "1",
          put: "2",
          patch: "3",
          delete: "4",
        };

        return methodsOrder[a.get("method")].localeCompare(
          methodsOrder[b.get("method")],
        );
      },
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
