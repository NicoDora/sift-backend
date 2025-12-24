import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { UserService } from "@src/modules/user/application/user.service";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: SignUpDto): Promise<{ message: string }> {
    await this.userService.signUp(dto);

    return {
      message: "회원가입이 성공적으로 완료되었습니다.",
    };
  }
}
