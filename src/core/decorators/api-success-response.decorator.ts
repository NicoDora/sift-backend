import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { BaseResponseDto } from "@src/common/dtos/api-response.dto";

export const ApiSuccessResponse = <TModel extends Type<any>>(
  model?: TModel,
  options?: { status?: number; message?: string },
) => {
  return applyDecorators(
    ApiExtraModels(BaseResponseDto, model || Object),
    ApiOkResponse({
      status: options?.status || 200,
      description: options?.message || "성공 응답",
      schema: {
        allOf: [
          { $ref: getSchemaPath(BaseResponseDto) },
          {
            properties: {
              data: model
                ? { $ref: getSchemaPath(model) }
                : { type: "object", nullable: true },
            },
          },
        ],
      },
    }),
  );
};
