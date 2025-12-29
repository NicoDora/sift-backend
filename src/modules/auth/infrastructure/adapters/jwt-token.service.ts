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

  async generateAccessToken(payload: IAccessTokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { token_type: "access", ...payload },
      {
        expiresIn: this.appConfigService.jwtAccessExpiresIn,
      },
    );
  }

  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { token_type: "refresh", ...payload },
      {
        expiresIn: this.appConfigService.jwtRefreshExpiresIn,
      },
    );
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verifyAsync(token);
  }
}
