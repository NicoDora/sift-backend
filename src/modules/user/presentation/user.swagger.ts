import { applyDecorators, HttpStatus } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApiErrorResponse } from "@src/core/decorators/api-error-response.decorator";
import { ApiSuccessResponse } from "@src/core/decorators/api-success-response.decorator";
import { UserProfileDto } from "@src/modules/user/presentation/dtos/user-profile.dto";

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

  getMe: () => {
    return applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: "내 정보 조회",
        description: "로그인된 사용자의 프로필 정보를 가져옵니다.",
      }),
      ApiSuccessResponse(UserProfileDto, {
        status: HttpStatus.OK,
        message: "내 정보 조회 성공",
      }),
      ApiErrorResponse([
        {
          status: HttpStatus.UNAUTHORIZED,
          description: "인증되지 않은 사용자",
        },
        {
          status: HttpStatus.NOT_FOUND,
          description: "사용자를 찾을 수 없음",
        },
      ]),
    );
  },
};
