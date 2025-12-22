import { Email } from "@src/modules/member/domain/vo/email.vo";
import { Nickname } from "@src/modules/member/domain/vo/nickname.vo";
import { Password } from "@src/modules/member/domain/vo/password.vo";
import { ProfileImageUrl } from "@src/modules/member/domain/vo/profile-image-url.vo";
import { Role } from "@src/modules/member/domain/vo/role.vo";
import { SocialProvider } from "@src/modules/member/domain/vo/social-provider.vo";
import { UserId } from "@src/modules/member/domain/vo/user-id.vo";

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
    socialId,
  }: CreateUserSocialProps): User {
    const now = new Date();
    return new User(
      UserId.create(),
      email,
      nickname,
      null,
      null,
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
}
