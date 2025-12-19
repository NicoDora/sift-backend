import {
  BadRequestException,
  INestApplication,
  Injectable,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppConfigService } from "@src/core/configs/app-config.service";

@Injectable()
export class BootstrapService {
  constructor(private readonly appConfigService: AppConfigService) {}

  setupSwagger(app: INestApplication) {
    if (this.appConfigService.isProduction) {
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

  setupPipe(app: INestApplication) {
    const options: Omit<ValidationPipeOptions, "exceptionFactory"> = {
      forbidNonWhitelisted: true,
      transform: true,
    };

    // 검증 오류(ValidationError[])를 받아서 BadRequestException으로 변환하는 로직
    const exceptionFactory = (validationErrors: ValidationError[]) => {
      // 1. 에러 객체를 순회하며 { 필드명: 에러메시지 } 형태로 변환
      const formatErrors = (
        errors: ValidationError[],
      ): Record<string, string> => {
        const result: Record<string, string> = {};

        for (const error of errors) {
          // constraints가 존재하면 (유효성 검사 실패)
          if (error.constraints) {
            // 여러 제약 조건 중 첫 번째 메시지만 클라이언트에 전달
            result[error.property] = Object.values(error.constraints)[0];
          }
        }

        return result;
      };

      const formattedErrors = formatErrors(validationErrors);

      // 2. 변환된 에러 객체를 담아 BadRequestException 발생
      // 이 예외는 앞서 만든 AllExceptionsFilter에 의해 캡처되어 표준 응답으로 변환됨
      return new BadRequestException(formattedErrors);
    };

    app.useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory,
      }),
    );
  }

  async startServer(app: INestApplication) {
    const port = this.appConfigService.port;

    await app.listen(port);
  }
}
