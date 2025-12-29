import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from "@nestjs/common";
import { AUTH_TOKENS } from "@src/modules/auth/auth.constant";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { ITokenService } from "@src/modules/auth/domain/service-interfaces/token-service.interface";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { UserService } from "@src/modules/user/application/user.service";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import { USER_TOKENS } from "@src/modules/user/user.constant";

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private readonly userService: UserService,
    @Inject(USER_TOKENS.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(AUTH_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      this.logger.warn(
        `로그인 실패: 존재하지 않는 이메일 (${dto.email})`,
        AuthService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const password = user.getPassword();
    if (!password) {
      this.logger.warn(
        `로그인 실패: 비밀번호 정보 없음 (${dto.email})`,
        AuthService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const isMatched = await password.compare(dto.password, this.passwordHasher);
    if (!isMatched) {
      this.logger.warn(
        `로그인 실패: 비밀번호 불일치 (${dto.email})`,
        AuthService.name,
      );
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

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
