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
      /**
       * 검증 오류 객체를 재귀적으로 순회하며 Flat한 에러 객체로 변환합니다.
       * @param errors 발생한 검증 오류 배열
       * @param parentPath 중첩된 객체의 경우 부모 키 경로 (예: 'address', 'items.0')
       */
      const formatErrors = (
        errors: ValidationError[],
        parentPath = "",
      ): Record<string, string> => {
        const result: Record<string, string> = {};

        for (const error of errors) {
          // 현재 필드의 전체 경로 생성 (예: 'address.city' 또는 'items.0.name')
          const currentPath = parentPath
            ? `${parentPath}.${error.property}`
            : error.property;

          // 1. 현재 레벨의 에러 처리 (constraints가 있으면 저장)
          if (error.constraints) {
            result[currentPath] = Object.values(error.constraints)[0];
          }

          // 2. 중첩된 에러 처리 (children이 있으면 재귀 호출)
          if (error.children && error.children.length > 0) {
            const childErrors = formatErrors(error.children, currentPath);
            // 재귀 호출 결과를 현재 결과 객체에 병합
            Object.assign(result, childErrors);
          }
        }

        return result;
      };

      const formattedErrors = formatErrors(validationErrors);

      // 변환된 에러 객체를 담아 BadRequestException 발생
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
