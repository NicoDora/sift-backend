import { applyDecorators } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, getSchemaPath } from "@nestjs/swagger";
import { ApiErrorResponseDto } from "@src/common/dtos/api-error-response.dto";

export const ApiErrorResponse = (
  errors: { status: number; description: string; message?: string }[],
) => {
  return applyDecorators(
    ApiExtraModels(ApiErrorResponseDto),
    ...errors.map((error) =>
      ApiResponse({
        status: error.status,
        description: error.description,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ApiErrorResponseDto) },
            {
              example: {
                timestamp: new Date().toISOString(),
                path: "...",
                statusCode: error.status,
                error: {
                  message: error.message || error.description,
                },
              },
            },
          ],
        },
      }),
    ),
  );
};
