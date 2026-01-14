import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { GoogleAuthService } from "@src/modules/auth/application/google-auth.service";
import { COOKIE_MAX_AGE, COOKIE_NAME } from "@src/modules/auth/auth.constant";
import {
  IGoogleAuthOptions,
  IHandleGoogleLoginParams,
} from "@src/modules/auth/domain/service-interfaces/google-auth.interface";
import { ApiAuth } from "@src/modules/auth/presentation/auth.swagger";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { CookieOptions, Request, Response } from "express";

@ApiTags("Auth (인증)")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly appConfigService: AppConfigService,
  ) {}

  /**
   * 공통 쿠키 옵션을 반환합니다.
   */
  private getCommonCookieOptions(maxAge: number): CookieOptions {
    return {
      httpOnly: true,
      secure: this.appConfigService.isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    };
  }

  @ApiAuth.login()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("로그인에 성공하였습니다.")
  async login(
    @Body() loginDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<{ accessToken: string }> {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie(
      COOKIE_NAME.REFRESH_TOKEN,
      refreshToken,
      this.getCommonCookieOptions(COOKIE_MAX_AGE.REFRESH_TOKEN),
    );

    return { accessToken };
  }

  @ApiAuth.googleLogin()
  @Get("google")
  @HttpCode(HttpStatus.FOUND)
  googleLogin(@Res() res: Response): void {
    const { url, state, nonce }: IGoogleAuthOptions =
      this.googleAuthService.generateAuthOptions();

    const cookieOptions = this.getCommonCookieOptions(
      COOKIE_MAX_AGE.GOOGLE_OAUTH,
    );

    // 쿠키에 state와 nonce 저장
    res.cookie(COOKIE_NAME.GOOGLE_STATE, state, cookieOptions);
    res.cookie(COOKIE_NAME.GOOGLE_NONCE, nonce, cookieOptions);

    return res.redirect(url);
  }

  @ApiAuth.googleAuthenticate()
  @Post("google/authenticate")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("구글 로그인에 성공하였습니다.")
  async googleAuthenticate(
    @Body("code") code: string,
    @Body("state") requestState: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    if (!code || !requestState) {
      throw new UnauthorizedException(
        "필수 인증 파라미터(code, state)가 누락되었습니다.",
      );
    }

    const savedState = req.cookies[COOKIE_NAME.GOOGLE_STATE];
    const savedNonce = req.cookies[COOKIE_NAME.GOOGLE_NONCE];

    const params: IHandleGoogleLoginParams = {
      code,
      savedState,
      requestState,
      savedNonce,
    };
    const { accessToken, refreshToken } =
      await this.googleAuthService.handleGoogleLogin(params);

    res.clearCookie(COOKIE_NAME.GOOGLE_STATE);
    res.clearCookie(COOKIE_NAME.GOOGLE_NONCE);

    res.cookie(
      COOKIE_NAME.REFRESH_TOKEN,
      refreshToken,
      this.getCommonCookieOptions(COOKIE_MAX_AGE.REFRESH_TOKEN),
    );

    return { accessToken };
  }
}
