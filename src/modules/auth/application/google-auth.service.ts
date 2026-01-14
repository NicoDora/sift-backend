import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { AUTH_TOKENS } from "@src/modules/auth/auth.constant";
import {
  IGoogleAuthOptions,
  IHandleGoogleLoginParams,
} from "@src/modules/auth/domain/service-interfaces/google-auth.interface";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { ITokenService } from "@src/modules/auth/domain/service-interfaces/token-service.interface";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { UserService } from "@src/modules/user/application/user.service";
import {
  Credentials,
  gaxios,
  OAuth2Client,
  TokenPayload,
} from "google-auth-library";
import { nanoid } from "nanoid";

const STATE_LENGTH = 30;
const NONCE_LENGTH = 30;

@Injectable()
export class GoogleAuthService {
  private readonly googleClient: OAuth2Client;
  private readonly logger = new Logger(GoogleAuthService.name);

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly userService: UserService,
    @Inject(AUTH_TOKENS.ITokenService)
    private readonly tokenService: ITokenService,
  ) {
    this.googleClient = new OAuth2Client({
      clientId: this.appConfigService.googleClientId,
      clientSecret: this.appConfigService.googleClientSecret,
      redirectUri: this.appConfigService.googleRedirectUri,
    });
  }

  /**
   * 구글 인증 URL 생성 및 보안 파라미터(state, nonce) 발급
   */
  generateAuthOptions(): IGoogleAuthOptions {
    this.logger.log("구글 인증 URL 생성을 시작합니다.");

    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const state = nanoid(STATE_LENGTH);
    const nonce = nanoid(NONCE_LENGTH);
    const options = {
      client_id: this.appConfigService.googleClientId,
      redirect_uri: this.appConfigService.googleRedirectUri,
      response_type: "code",
      scope: ["openid", "email", "profile"].join(" "),
      access_type: "offline",
      state,
      nonce,
      prompt: "select_account",
    };

    return {
      url: `${rootUrl}?${new URLSearchParams(options).toString()}`,
      state,
      nonce,
    };
  }

  /**
   * 콜백 처리: 구글 인가 코드를 우리 서비스의 토큰으로 교환
   */
  async handleGoogleLogin(
    params: IHandleGoogleLoginParams,
  ): Promise<LoginResponseDto> {
    const { code, savedState, requestState, savedNonce } = params;

    this.logger.log("구글 로그인을 처리합니다.");

    if (!code) {
      throw new UnauthorizedException("인증 코드가 없습니다.");
    }

    if (savedState === undefined || savedNonce === undefined) {
      throw new UnauthorizedException(
        "로그인 세션이 만료되었습니다. 다시 시도해주세요.",
      );
    }

    // A. State 검증 (CSRF 방지)
    if (savedState !== requestState) {
      throw new UnauthorizedException("유효하지 않은 인증 상태(state)입니다.");
    }

    // B. 구글 토큰 발급 (ID Token 포함)
    const { id_token } = await this.exchangeCodeForTokens(code);

    if (!id_token) {
      throw new UnauthorizedException("구글 ID 토큰이 발급되지 않았습니다.");
    }

    // C. ID Token 검증 및 nonce 확인 (재전송 공격 방지)
    const googlePayload = await this.verifyGoogleIdToken(id_token);

    if (googlePayload.nonce !== savedNonce) {
      throw new UnauthorizedException(
        "ID 토큰 보안 검증(nonce)에 실패했습니다.",
      );
    }

    if (!googlePayload.email_verified) {
      throw new UnauthorizedException(
        "구글 이메일 인증이 완료되지 않았습니다.",
      );
    }

    // D. 우리 서비스 유저 처리 (회원가입 또는 로그인)
    const user = await this.userService.createSocialUser({
      email: googlePayload.email,
      nickname: googlePayload.name,
      socialId: googlePayload.sub,
      profileImageUrl: googlePayload.picture,
      provider: "GOOGLE",
    });

    const sub = user.getId().getValue();
    const email = user.getEmail().getValue();
    const role = user.getRole().getValue();

    const accessTokenPayload: IAccessTokenPayload = {
      sub,
      email,
      role,
    };
    const refreshTokenPayload: IRefreshTokenPayload = {
      sub,
    };

    // E. 자체 서비스 토큰 발급
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(accessTokenPayload),
      this.tokenService.generateRefreshToken(refreshTokenPayload),
    ]);

    this.logger.log(`구글 로그인이 성공적으로 완료되었습니다: ${email}`);

    return new LoginResponseDto(accessToken, refreshToken);
  }

  /**
   * 구글 서버에 Code를 주고 ID Token을 받아옴
   */
  private async exchangeCodeForTokens(code: string): Promise<Credentials> {
    this.logger.log("구글 서버와 인가 코드를 토큰으로 교환합니다.");

    try {
      const { tokens } = await this.googleClient.getToken(code);
      return tokens;
    } catch (error) {
      let errorMessage = "구글 토큰 발급에 실패했습니다.";

      if (error instanceof gaxios.GaxiosError) {
        // google-auth-library는 에러 발생 시 response data를 포함할 수 있습니다.
        const responseData = error.response?.data;
        if (responseData) {
          this.logger.warn(
            `구글 토큰 교환 실패 상세: ${JSON.stringify(responseData)}`,
          );
          errorMessage = `구글 토큰 교환 실패: ${responseData.error_description || error.message}`;
        } else {
          errorMessage = `구글 토큰 교환 실패: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `구글 토큰 교환 실패: ${error.message}`;
      }

      throw new UnauthorizedException(errorMessage);
    }
  }

  /**
   * 구글 ID 토큰 검증
   */
  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    this.logger.log("구글 ID 토큰을 검증합니다.");
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.appConfigService.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("ID 토큰 페이로드가 비어있습니다.");
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException(
        `구글 ID 토큰 검증 실패: ${error instanceof Error ? error.message : "알 수 없는 오류"}`,
      );
    }
  }
}
