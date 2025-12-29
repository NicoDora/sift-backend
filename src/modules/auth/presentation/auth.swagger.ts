import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "@src/core/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "@src/core/decorators/api-success-response.decorator";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";

export const ApiAuth = {
  login: () => {
    return applyDecorators(
      ApiOperation({
        summary: "로그인",
        description: "이메일과 비밀번호로 JWT를 발급받습니다.",
      }),
      ApiSuccessResponse(LoginResponseDto, { message: "로그인 성공" }),
      ApiErrorResponse([
        { status: HttpStatus.BAD_REQUEST, description: "잘못된 입력값" },
        {
          status: HttpStatus.UNAUTHORIZED,
          description: "인증 실패",
          message: "이메일 또는 비밀번호 불일치",
        },
        { status: HttpStatus.INTERNAL_SERVER_ERROR, description: "서버 에러" },
      ]),
    );
  },
};
