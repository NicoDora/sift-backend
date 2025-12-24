import { Injectable } from "@nestjs/common";
import { User as PrismaUser } from "@prisma/client";
import { IMapper } from "@src/common/infrastructure/interfaces/mapper.interface";
import { User } from "@src/modules/user/domain/entities/user.entity";
import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { Nickname } from "@src/modules/user/domain/value-objects/nickname.vo";
import { Password } from "@src/modules/user/domain/value-objects/password.vo";
import { ProfileImageUrl } from "@src/modules/user/domain/value-objects/profile-image-url.vo";
import { Role } from "@src/modules/user/domain/value-objects/role.vo";
import { SocialProvider } from "@src/modules/user/domain/value-objects/social-provider.vo";
import { UserId } from "@src/modules/user/domain/value-objects/user-id.vo";

@Injectable()
export class UserMapper implements IMapper<User, PrismaUser> {
  /**
   * 도메인 -> DB
   */
  public toPersistence(user: User): PrismaUser {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      nickname: user.getNickname().getValue(),
      password: user.getPassword()?.getValue() ?? null,
      profileImageUrl: user.getProfileImageUrl()?.getValue() ?? null,
      role: user.getRole().getValue(),
      socialProvider: user.getSocialProvider().getValue(),
      socialId: user.getSocialId() ?? null,
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
      deletedAt: user.getDeletedAt(),
    };
  }

  /**
   * DB -> 도메인
   */
  public toDomain(raw: PrismaUser): User {
    return User.restore({
      id: UserId.restore(raw.id),
      email: Email.restore(raw.email),
      nickname: Nickname.restore(raw.nickname),
      password: raw.password ? Password.restore(raw.password) : null,
      profileImageUrl: raw.profileImageUrl
        ? ProfileImageUrl.restore(raw.profileImageUrl)
        : null,
      role: Role.restore(raw.role),
      socialProvider: SocialProvider.restore(raw.socialProvider),
      socialId: raw.socialId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    });
  }
}
