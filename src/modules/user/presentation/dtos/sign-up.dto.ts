import { ApiProperty } from "@nestjs/swagger";
import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "@src/modules/user/domain/value-objects/nickname.vo";
import { PASSWORD_MIN_LENGTH } from "@src/modules/user/domain/value-objects/password.vo";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

// TODO: 아키텍처 분리를 위해 추후 Command 도입 검토
export class SignUpDto {
  @ApiProperty({ example: "user@example.com", description: "이메일" })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: "이메일은 필수입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  readonly email: string;

  @ApiProperty({ example: "nickname", description: "닉네임" })
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: "닉네임은 필수입니다." })
  @IsString()
  @MinLength(NICKNAME_MIN_LENGTH, {
    message: `닉네임은 최소 ${NICKNAME_MIN_LENGTH}자 이상이어야 합니다.`,
  })
  @MaxLength(NICKNAME_MAX_LENGTH, {
    message: `닉네임은 최대 ${NICKNAME_MAX_LENGTH}자 이하여야 합니다.`,
  })
  readonly nickname: string;

  @ApiProperty({ example: "password1234", description: "비밀번호" })
  @IsNotEmpty({ message: "비밀번호는 필수입니다." })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
  })
  readonly password: string;
}
