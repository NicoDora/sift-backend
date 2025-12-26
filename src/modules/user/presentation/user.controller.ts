import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { UserService } from "@src/modules/user/application/user.service";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("회원가입이 성공적으로 완료되었습니다.")
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    await this.userService.signUp(signUpDto);
  }
}
