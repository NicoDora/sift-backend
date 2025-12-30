import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { TOKEN_TYPE } from "@src/modules/auth/auth.constant";
import { IDecodedRefreshTokenPayload } from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh",
) {
  constructor(private readonly appConfigService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: IDecodedRefreshTokenPayload) {
    if (!payload || payload.type !== TOKEN_TYPE.REFRESH || !payload.sub) {
      throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
    }

    const refreshToken = req.get("Authorization").replace("Bearer", "").trim();

    return {
      userId: payload.sub,
      refreshToken,
    };
  }
}
