import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { UserService } from "@src/modules/user/application/user.service";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";
import { ApiUser } from "@src/modules/user/presentation/user.swagger";

@ApiTags("Users (사용자)")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiUser.signUp()
  @Post("signup")
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage("회원가입이 성공적으로 완료되었습니다.")
  async signUp(@Body() signUpDto: SignUpDto): Promise<void> {
    await this.userService.signUp(signUpDto);
  }
}
