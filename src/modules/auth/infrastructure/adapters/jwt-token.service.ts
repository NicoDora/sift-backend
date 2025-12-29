import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppConfigService } from "@src/core/configs/app-config.service";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { ITokenService } from "@src/modules/auth/domain/service-interfaces/token-service.interface";

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
  ) {}

  generateAccessToken(payload: IAccessTokenPayload): string {
    return this.jwtService.sign(
      { token_type: "access", ...payload },
      {
        expiresIn: this.appConfigService.jwtAccessExpiresIn,
      },
    );
  }

  generateRefreshToken(payload: IRefreshTokenPayload): string {
    return this.jwtService.sign(
      { token_type: "refresh", ...payload },
      {
        expiresIn: this.appConfigService.jwtRefreshExpiresIn,
      },
    );
  }

  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }
}
