import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { GetUser } from "@src/core/decorators/get-user.decorator";
import { ResponseMessage } from "@src/core/decorators/response-message.decorator";
import { IAuthUser } from "@src/modules/auth/domain/service-interfaces/jwt-payload.interface";
import { JwtAccessGuard } from "@src/modules/auth/presentation/guards/jwt-access.guard";
import { UserService } from "@src/modules/user/application/user.service";
import { SignUpDto } from "@src/modules/user/presentation/dtos/sign-up.dto";
import { UserProfileDto } from "@src/modules/user/presentation/dtos/user-profile.dto";
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

  @ApiUser.getMe()
  @UseGuards(JwtAccessGuard)
  @Get("me")
  @HttpCode(HttpStatus.OK)
  @ResponseMessage("내 정보를 성공적으로 가져왔습니다.")
  async getMe(@GetUser() user: IAuthUser): Promise<UserProfileDto> {
    const userEntity = await this.userService.getUserProfile(user.id);
    return UserProfileDto.fromEntity(userEntity);
  }
}
