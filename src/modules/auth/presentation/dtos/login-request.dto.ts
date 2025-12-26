import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginRequestDto {
  @ApiProperty({ example: "user@example.com", description: "이메일" })
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  @IsNotEmpty({ message: "이메일은 필수입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  readonly email: string;

  @ApiProperty({ example: "password1234", description: "비밀번호" })
  @IsNotEmpty({ message: "비밀번호는 필수입니다." })
  @IsString()
  readonly password: string;
}
