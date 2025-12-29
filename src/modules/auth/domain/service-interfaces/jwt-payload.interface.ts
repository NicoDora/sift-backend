import { RoleType } from "@src/modules/user/domain/value-objects/role.vo";

interface IBaseJwtPayload {
  sub: string;
}

export interface IAccessTokenPayload extends IBaseJwtPayload {
  email: string;
  role: RoleType;
}

export interface IRefreshTokenPayload extends IBaseJwtPayload {}
