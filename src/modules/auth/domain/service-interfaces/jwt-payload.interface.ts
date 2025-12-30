import { TOKEN_TYPE } from "@src/modules/auth/auth.constant";
import { RoleType } from "@src/modules/user/domain/value-objects/role.vo";

export type TokenType = (typeof TOKEN_TYPE)[keyof typeof TOKEN_TYPE];

interface IBaseJwtPayload {
  sub: string;
}

export interface IAccessTokenPayload extends IBaseJwtPayload {
  email: string;
  role: RoleType;
}

export interface IRefreshTokenPayload extends IBaseJwtPayload {}

export interface IJwtPayload extends IBaseJwtPayload {
  type: TokenType;
}

export interface IDecodedAccessTokenPayload
  extends IAccessTokenPayload, IJwtPayload {
  type: typeof TOKEN_TYPE.ACCESS;
}

export interface IDecodedRefreshTokenPayload
  extends IRefreshTokenPayload, IJwtPayload {
  type: typeof TOKEN_TYPE.REFRESH;
}
