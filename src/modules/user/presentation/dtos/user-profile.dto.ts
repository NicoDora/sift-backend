import { ApiProperty } from "@nestjs/swagger";
import { User } from "@src/modules/user/domain/entities/user.entity";

export class UserProfileDto {
  @ApiProperty({
    example: "123e4567",
    description: "사용자 ID",
  })
  readonly id: string;

  @ApiProperty({ example: "user@example.com", description: "이메일" })
  readonly email: string;

  @ApiProperty({ example: "user123", description: "닉네임" })
  readonly nickname: string;

  @ApiProperty({
    example: "https://example.com/profile.jpg",
    description: "프로필 이미지 URL",
    required: false,
    nullable: true,
  })
  readonly profileImageUrl: string | null;

  @ApiProperty({ example: "USER", description: "사용자 권한" })
  readonly role: string;

  @ApiProperty({ example: "LOCAL", description: "소셜 제공자" })
  readonly socialProvider: string;

  @ApiProperty({ example: "2023-01-01T00:00:00.000Z", description: "가입일" })
  readonly createdAt: Date;

  constructor(user: User) {
    this.id = user.getId().getValue();
    this.email = user.getEmail().getValue();
    this.nickname = user.getNickname().getValue();
    this.profileImageUrl = user.getProfileImageUrl()?.getValue() ?? null;
    this.role = user.getRole().getValue();
    this.socialProvider = user.getSocialProvider().getValue();
    this.createdAt = user.getCreatedAt();
  }

  static fromEntity(user: User): UserProfileDto {
    return new UserProfileDto(user);
  }
}
