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

  googleLogin: () => {
    return applyDecorators(
      ApiOperation({
        summary: "구글 로그인 페이지 리다이렉트",
        description:
          "구글 OAuth2 인증 페이지로 리다이렉트합니다. 보안을 위해 CSRF 방지용 state와 nonce 쿠키를 설정합니다.",
      }),
    );
  },

  googleAuthenticate: () => {
    return applyDecorators(
      ApiOperation({
        summary: "구글 로그인 인증",
        description:
          "구글로부터 전달받은 code와 state를 이용하여 인증을 진행하고 JWT를 발급받습니다.",
      }),
      ApiSuccessResponse(LoginResponseDto, { message: "구글 로그인 성공" }),
      ApiErrorResponse([
        {
          status: HttpStatus.BAD_REQUEST,
          description: "필수 인증 파라미터 누락",
        },
        {
          status: HttpStatus.UNAUTHORIZED,
          description: "인증 실패 (state 불일치 또는 만료된 세션)",
        },
        { status: HttpStatus.INTERNAL_SERVER_ERROR, description: "서버 에러" },
      ]),
    );
  },
};
