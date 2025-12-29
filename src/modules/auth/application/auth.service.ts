import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { AUTH_TOKENS } from "@src/modules/auth/auth.constant";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { ITokenService } from "@src/modules/auth/domain/service-interfaces/token-service.interface";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { UserService } from "@src/modules/user/application/user.service";

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly userService: UserService,
    @Inject(AUTH_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.validateCredentials(
      dto.email,
      dto.password,
    );

    const accessTokenPayload: IAccessTokenPayload = {
      sub: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    };
    const refreshTokenPayload: IRefreshTokenPayload = {
      sub: user.getId().getValue(),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(accessTokenPayload),
      this.tokenService.generateRefreshToken(refreshTokenPayload),
    ]);

    this.logger.log(`로그인 성공: ${dto.email}`, AuthService.name);

    return new LoginResponseDto(accessToken, refreshToken);
  }
}
