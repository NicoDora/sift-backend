import {
  NICKNAME_MAX_LENGTH,
  NICKNAME_MIN_LENGTH,
} from "@src/modules/member/domain/vo/nickname.vo";
import { PASSWORD_MIN_LENGTH } from "@src/modules/member/domain/vo/password.vo";
import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignUpDto {
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty({ message: "이메일은 필수입니다." })
  @IsEmail({}, { message: "유효한 이메일 형식이 아닙니다." })
  readonly email: string;

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

  @IsNotEmpty({ message: "비밀번호는 필수입니다." })
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, {
    message: `비밀번호는 최소 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`,
  })
  readonly password: string;
}
