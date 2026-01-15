import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { Nickname } from "@src/modules/user/domain/value-objects/nickname.vo";
import { Password } from "@src/modules/user/domain/value-objects/password.vo";
import { ProfileImageUrl } from "@src/modules/user/domain/value-objects/profile-image-url.vo";
import { Role } from "@src/modules/user/domain/value-objects/role.vo";
import { SocialProvider } from "@src/modules/user/domain/value-objects/social-provider.vo";
import { UserId } from "@src/modules/user/domain/value-objects/user-id.vo";

export type CreateUserLocalProps = {
  email: Email;
  nickname: Nickname;
  password: Password;
};

export type CreateUserSocialProps = {
  email: Email;
  nickname: Nickname;
  provider: SocialProvider;
  socialId: string;
  profileImageUrl: ProfileImageUrl | null;
};

export class User {
  private constructor(
    private readonly id: UserId,
    private email: Email,
    private nickname: Nickname,
    private password: Password | null,
    private profileImageUrl: ProfileImageUrl | null,
    private role: Role,
    private readonly socialProvider: SocialProvider,
    private readonly socialId: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private deletedAt: Date | null,
  ) {}

  public static createLocal({
    email,
    nickname,
    password,
  }: CreateUserLocalProps): User {
    const now = new Date();
    return new User(
      UserId.create(),
      email,
      nickname,
      password,
      null,
      Role.User(),
      SocialProvider.Local(),
      null,
      now,
      now,
      null,
    );
  }

  public static createSocial({
    email,
    nickname,
    provider,
    profileImageUrl,
    socialId,
  }: CreateUserSocialProps): User {
    const now = new Date();
    return new User(
      UserId.create(),
      email,
      nickname,
      null,
      profileImageUrl,
      Role.User(),
      provider,
      socialId,
      now,
      now,
      null,
    );
  }

  public static restore(props: {
    id: UserId;
    email: Email;
    nickname: Nickname;
    password: Password | null;
    profileImageUrl: ProfileImageUrl | null;
    role: Role;
    socialProvider: SocialProvider;
    socialId: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
  }): User {
    return new User(
      props.id,
      props.email,
      props.nickname,
      props.password,
      props.profileImageUrl,
      props.role,
      props.socialProvider,
      props.socialId,
      props.createdAt,
      props.updatedAt,
      props.deletedAt,
    );
  }

  public changeNickname(newNickname: Nickname): void {
    this.nickname = newNickname;
    this.updatedAt = new Date();
  }

  public updateProfileImage(url: ProfileImageUrl): void {
    this.profileImageUrl = url;
    this.updatedAt = new Date();
  }

  public leave(): void {
    this.deletedAt = new Date();
    this.updatedAt = new Date();
  }

  public getId(): UserId {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getNickname(): Nickname {
    return this.nickname;
  }

  public getRole(): Role {
    return this.role;
  }

  public getSocialProvider(): SocialProvider {
    return this.socialProvider;
  }

  public getPassword(): Password | null {
    return this.password;
  }

  public getProfileImageUrl(): ProfileImageUrl | null {
    return this.profileImageUrl;
  }

  public getSocialId(): string | null {
    return this.socialId;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getDeletedAt(): Date | null {
    return this.deletedAt;
  }
}
