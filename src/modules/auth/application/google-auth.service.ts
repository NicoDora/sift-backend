import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
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

const idSize = 30;

@Injectable()
export class GoogleAuthService {
  private readonly googleClient: OAuth2Client;

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
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const state = nanoid(idSize);
    const nonce = nanoid(idSize);
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

    if (!code) {
      throw new UnauthorizedException("인증 코드가 없습니다.");
    }

    // A. State 검증 (CSRF 방지)
    if (!savedState || savedState !== requestState) {
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

    // D. 우리 서비스 유저 처리 (회원가입 또는 조회)
    let user = await this.userService.getUserBySocialId(googlePayload.sub);

    if (!user) {
      user = await this.userService.createSocialUser({
        email: googlePayload.email,
        nickname: googlePayload.name,
        socialId: googlePayload.sub,
        profileImageUrl: googlePayload.picture,
        provider: "GOOGLE",
      });
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

    return new LoginResponseDto(accessToken, refreshToken);
  }

  /**
   * 구글 서버에 Code를 주고 ID Token을 받아옴
   */
  private async exchangeCodeForTokens(code: string) {
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
      throw new UnauthorizedException("구글 토큰 발급에 실패했습니다.");
    }
  }

  /**
   * 구글 ID 토큰 검증
   */
  private async verifyGoogleIdToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: this.appConfigService.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException("ID 토큰 페이로드가 비어있습니다.");
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException("유효하지 않은 구글 ID 토큰입니다.");
    }
  }
}
