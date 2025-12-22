export const SocialProviderTypes = {
  LOCAL: "LOCAL",
  GOOGLE: "GOOGLE",
  NAVER: "NAVER",
} as const;

export type SocialProviderType =
  (typeof SocialProviderTypes)[keyof typeof SocialProviderTypes];

export class SocialProvider {
  private constructor(private readonly value: SocialProviderType) {}

  public static create(value: string): SocialProvider {
    const upperValue = value.toUpperCase();
    this.validate(upperValue);

    return new SocialProvider(upperValue as SocialProviderType);
  }

  public static Local(): SocialProvider {
    return new SocialProvider(SocialProviderTypes.LOCAL);
  }

  public static Google(): SocialProvider {
    return new SocialProvider(SocialProviderTypes.GOOGLE);
  }

  public static Naver(): SocialProvider {
    return new SocialProvider(SocialProviderTypes.NAVER);
  }

  public static restore(value: string): SocialProvider {
    this.validate(value);
    return new SocialProvider(value as SocialProviderType);
  }

  public getValue(): SocialProviderType {
    return this.value;
  }

  public isLocal(): boolean {
    return this.value === SocialProviderTypes.LOCAL;
  }

  public isGoogle(): boolean {
    return this.value === SocialProviderTypes.GOOGLE;
  }

  public isNaver(): boolean {
    return this.value === SocialProviderTypes.NAVER;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof SocialProvider)) return false;
    return this.value === other.getValue();
  }

  private static validate(value: string): void {
    const isValid = Object.values(SocialProviderTypes).includes(
      value as SocialProviderType,
    );

    if (!isValid) {
      throw new Error(`알 수 없는 Social Provider 타입입니다: ${value}`);
    }
  }
}
