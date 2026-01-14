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
import axios from "axios";
import { OAuth2Client, TokenPayload } from "google-auth-library";
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
    this.googleClient = new OAuth2Client(this.appConfigService.googleClientId);
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

    // D. 우리 서비스 유저 처리 (회원가입 또는 조회)
    let user = await this.userService.getUserBySocialId(googlePayload.sub);

    if (!user) {
      this.logger.log(
        `새로운 구글 사용자 생성 시도: ${googlePayload.email} (sub: ${googlePayload.sub})`,
      );
      user = await this.userService.createSocialUser({
        email: googlePayload.email,
        nickname: googlePayload.name,
        socialId: googlePayload.sub,
        profileImageUrl: googlePayload.picture,
        provider: "GOOGLE",
      });
    } else {
      this.logger.log(
        `기존 구글 사용자로 로그인합니다: ${googlePayload.email}`,
      );
    }

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
  private async exchangeCodeForTokens(code: string) {
    this.logger.log("구글 서버와 인가 코드를 토큰으로 교환합니다.");

    const url = "https://oauth2.googleapis.com/token";
    const params = {
      code,
      client_id: this.appConfigService.googleClientId,
      client_secret: this.appConfigService.googleClientSecret,
      redirect_uri: this.appConfigService.googleRedirectUri,
      grant_type: "authorization_code",
    };

    try {
      const res = await axios.post(url, new URLSearchParams(params), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      return res.data;
    } catch (error) {
      // 에러 메시지만 가공하여 예외를 던집니다. 실제 로깅은 AllExceptionsFilter에서 처리됩니다.
      let errorMessage = "구글 토큰 발급에 실패했습니다.";

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        // 필터가 잡지 못하는 Axios의 상세 응답 에러를 로그로 남겨둡니다.
        this.logger.warn(
          `구글 토큰 교환 실패 상세: ${JSON.stringify(responseData)}`,
        );
        errorMessage = `구글 토큰 교환 실패: ${responseData?.error_description || error.message}`;
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
