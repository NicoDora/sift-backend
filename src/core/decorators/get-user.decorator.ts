import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import {
  IAuthUser,
  IRefreshTokenUser,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";

type UserKey = keyof IAuthUser | keyof IRefreshTokenUser;

/**
 * Request 객체에서 인증된 사용자 정보를 추출하는 커스텀 데코레이터입니다.
 *
 * @example
 * // 전체 유저 객체 가져오기
 * @Get()
 * someMethod(@GetUser() user: IAuthUser) { ... }
 *
 * // 특정 필드만 가져오기
 * @Get()
 * someMethod(@GetUser('userId') userId: string) { ... }
 */
export const GetUser = createParamDecorator(
  (data: UserKey | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
