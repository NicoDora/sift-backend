import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";

export interface ITokenService {
  generateAccessToken(payload: IAccessTokenPayload): string;
  generateRefreshToken(payload: IRefreshTokenPayload): string;
  verifyToken(token: string): any;
}
