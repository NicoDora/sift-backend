import { Url } from "@src/common/domain/vo/url.base";

export class ProfileImageUrl extends Url {
  private constructor(value: string) {
    super(value);
  }

  public static create(url: string): ProfileImageUrl {
    if (!url) {
      return this.default();
    }

    super.validate(url);

    // 추가 규칙: 이미지 파일 확장자 검사 등
    // if (!url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) { ... }

    return new ProfileImageUrl(url);
  }

  public static restore(url: string): ProfileImageUrl {
    return new ProfileImageUrl(url);
  }

  private static default(): ProfileImageUrl {
    return new ProfileImageUrl(
      "https://cdn.yourservice.com/default-profile.png",
    );
  }
}
