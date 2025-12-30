import { TOKEN_TYPE } from "@src/modules/auth/auth.constant";
import { RoleType } from "@src/modules/user/domain/value-objects/role.vo";

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

/**
 * JWT 생성 시 페이로드 기본 구조
 */
interface IBaseJwtData {
  sub: string;
}

/**
 * 액세스 토큰 생성 시 페이로드
 */
export interface IAccessTokenPayload extends IBaseJwtData {
  email: string;
  role: RoleType;
}

/**
 * 리프레시 토큰 생성 시 페이로드
 */
export interface IRefreshTokenPayload extends IBaseJwtData {}

/**
 * JWT 메타데이터
 */
interface IJwtMeta {
  type: TokenType;
  iat?: number;
  exp?: number;
}

/**
 * 디코딩된 액세스 토큰 페이로드
 */
export interface IDecodedAccessTokenPayload
  extends IAccessTokenPayload, IJwtMeta {
  type: typeof TOKEN_TYPE.ACCESS;
}

/**
 * 디코딩된 리프레시 토큰 페이로드
 */
export interface IDecodedRefreshTokenPayload
  extends IRefreshTokenPayload, IJwtMeta {
  type: typeof TOKEN_TYPE.REFRESH;
}

/**
 * 사용자 인증 정보 (액세스 토큰 검증 결과)
 */
export interface IAuthUser {
  id: string;
  email: string;
  role: RoleType;
}

/**
 * 리프레시 토큰 검증 결과 사용자 정보
 */
export interface IRefreshTokenUser {
  id: string;
  refreshToken: string;
}
