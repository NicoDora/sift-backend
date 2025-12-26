import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { AuthService } from "@src/modules/auth/application/auth.service";
import { ApiAuth } from "@src/modules/auth/presentation/auth.swagger";
import { LoginRequestDto } from "@src/modules/auth/presentation/dtos/login-request.dto";
import { LoginResponseDto } from "@src/modules/auth/presentation/dtos/login-response.dto";

@ApiTags("Auth (인증)")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiAuth.login()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("로그인에 성공하였습니다.")
  async login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const result = await this.authService.login(loginDto);

    return result;
  }
}
