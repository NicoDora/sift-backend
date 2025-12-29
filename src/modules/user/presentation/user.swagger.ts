import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "@src/core/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "@src/core/decorators/api-success-response.decorator";

export const ApiUser = {
  signUp: () => {
    return applyDecorators(
      ApiOperation({ summary: "회원가입" }),
      ApiSuccessResponse(undefined, {
        status: HttpStatus.CREATED,
        message: "회원가입 완료",
      }),
      ApiErrorResponse([
        {
          status: HttpStatus.BAD_REQUEST,
          description: "이메일 중복 또는 입력값 오류",
        },
      ]),
    );
  },
};
