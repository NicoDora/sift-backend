import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { GoogleAuthService } from "@src/modules/auth/application/google-auth.service";
import {
  IGoogleAuthOptions,
  IHandleGoogleLoginParams,
} from "@src/modules/auth/domain/service-interfaces/google-auth.interface";
import { ApiAuth } from "@src/modules/auth/presentation/auth.swagger";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { Request, Response } from "express";

@ApiTags("Auth (인증)")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @ApiAuth.login()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("로그인에 성공하였습니다.")
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);

    return result;
  }

  @Get("google")
  @HttpCode(HttpStatus.FOUND)
  googleLogin(@Res() res: Response): void {
    const { url, state, nonce }: IGoogleAuthOptions =
      this.googleAuthService.generateAuthOptions();

    const cookieOptions = {
      httpOnly: true,
      secure: true,
      maxAge: 300000, // 5 minutes
    };

    // 쿠키에 state와 nonce 저장
    res.cookie("google_state", state, cookieOptions);
    res.cookie("google_nonce", nonce, cookieOptions);

    return res.redirect(url);
  }

  @Get("google/callback")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("구글 로그인에 성공하였습니다.")
  async googleCallback(
    @Query("code") code: string,
    @Query("state") requestState: string,
    @Req() req: Request,
  ): Promise<LoginResponseDto> {
    const savedState = req.cookies["google_state"];
    const savedNonce = req.cookies["google_nonce"];

    const params: IHandleGoogleLoginParams = {
      code,
      savedState,
      requestState,
      savedNonce,
    };
    const result = await this.googleAuthService.handleGoogleLogin(params);

    return result;
  }
}
