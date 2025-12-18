import { INestApplication, Injectable } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

@Injectable()
export class BootstrapService {
  setupSwagger(app: INestApplication) {
    if (process.env.NODE_ENV === "production") {
      return;
    }

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
        operationsSorter: (a: any, b: any) => {
          const methodsOrder: Record<string, number> = {
            post: 0,
            get: 1,
            put: 2,
            patch: 3,
            delete: 4,
          };

          const aMethod = a.get("method");
          const bMethod = b.get("method");

          const aMethodOrder = methodsOrder[aMethod] ?? 9;
          const bMethodOrder = methodsOrder[bMethod] ?? 9;

          return aMethodOrder - bMethodOrder;
        },
      },
    });
  }

  async startServer(app: INestApplication) {
    const port = process.env.PORT || 3000;

    await app.listen(port);
  }
}
