import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";

export interface ITokenService {
  generateAccessToken(payload: IAccessTokenPayload): Promise<string>;
  generateRefreshToken(payload: IRefreshTokenPayload): Promise<string>;
}
