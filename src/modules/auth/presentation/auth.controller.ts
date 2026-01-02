import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { GoogleAuthService } from "@src/modules/auth/application/google-auth.service";
import { ApiAuth } from "@src/modules/auth/presentation/auth.swagger";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";
import { Response } from "express";

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
  async googleLogin(@Res() res: Response) {
    const { url, state, nonce } = this.googleAuthService.generateAuthOptions();

    // 쿠키에 state와 nonce 저장 (HttpOnly로 자바스크립트 접근 차단, 5분 만료)
    res.cookie("google_state", state, {
      httpOnly: true,
      secure: true,
      maxAge: 300000,
    });
    res.cookie("google_nonce", nonce, {
      httpOnly: true,
      secure: true,
      maxAge: 300000,
    });

    return res.redirect(url);
  }
}
