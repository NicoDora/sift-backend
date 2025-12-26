import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { AUTH_TOKENS } from "@src/modules/auth/auth.constant";
import { ITokenService } from "@src/modules/auth/domain/service-interfaces/token-service.interface";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { UserService } from "@src/modules/user/application/user.service";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import { USER_TOKENS } from "@src/modules/user/user.constant";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @Inject(USER_TOKENS.IPasswordHasher)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(AUTH_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {}

  async login(dto: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const password = user.getPassword();
    if (!password) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const isMatched = await password.compare(dto.password, this.passwordHasher);
    if (!isMatched) {
      throw new UnauthorizedException(
        "이메일 또는 비밀번호가 일치하지 않습니다.",
      );
    }

    const accessToken = this.tokenService.generateAccessToken({
      sub: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      sub: user.getId().getValue(),
      email: user.getEmail().getValue(),
      role: user.getRole().getValue(),
    });

    return new LoginResponseDto(accessToken, refreshToken);
  }
}
