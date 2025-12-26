import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("로그인에 성공하였습니다.")
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);

    return result;
  }
}
