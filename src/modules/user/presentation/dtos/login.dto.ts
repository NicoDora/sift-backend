import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty({ message: "이메일은 필수입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  readonly email: string;

  @IsNotEmpty({ message: "비밀번호는 필수입니다." })
  @IsString()
  readonly password: string;
}
