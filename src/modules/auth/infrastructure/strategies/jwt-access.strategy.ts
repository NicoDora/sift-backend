import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { TOKEN_TYPE } from "@src/modules/auth/auth.constant";
import {
  IAuthUser,
  IDecodedAccessTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  "jwt-access",
) {
  constructor(
    private readonly appConfigService: AppConfigService,
    @Inject(Logger) private readonly logger: LoggerService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfigService.jwtSecret,
    });
  }

  async validate(payload: IDecodedAccessTokenPayload): Promise<IAuthUser> {
    if (
      !payload ||
      payload.type !== TOKEN_TYPE.ACCESS ||
      !payload.sub ||
      !payload.email ||
      !payload.role
    ) {
      this.logger.warn(
        `액세스 토큰 검증 실패: ${JSON.stringify(payload)}`,
        JwtAccessStrategy.name,
      );
      throw new UnauthorizedException("유효하지 않은 액세스 토큰입니다.");
    }

    this.logger.log(
      `액세스 토큰 검증 성공: ${payload.email} (${payload.sub})`,
      JwtAccessStrategy.name,
    );

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
