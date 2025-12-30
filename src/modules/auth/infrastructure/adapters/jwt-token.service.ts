import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { TOKEN_TYPE } from "@src/modules/auth/auth.constant";
import {
  IAccessTokenPayload,
  IJwtPayload,
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
      { type: TOKEN_TYPE.ACCESS, ...payload },
      {
        expiresIn: this.appConfigService.jwtAccessExpiresIn,
      },
    );
  }

  async generateRefreshToken(payload: IRefreshTokenPayload): Promise<string> {
    return this.jwtService.signAsync(
      { type: TOKEN_TYPE.REFRESH, ...payload },
      {
        expiresIn: this.appConfigService.jwtRefreshExpiresIn,
      },
    );
  }

  async verifyToken(token: string): Promise<IJwtPayload> {
    return this.jwtService.verifyAsync(token);
  }
}
