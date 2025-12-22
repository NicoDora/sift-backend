const MIN_LENGTH = 2;
const MAX_LENGTH = 12;
const NICKNAME_REGEX = /^[a-zA-Z0-9]+$/;

export class Nickname {
  private constructor(private readonly value: string) {}

  public static create(nickname: string): Nickname {
    const trimmed = nickname?.trim();

    // 1. 빈 값 체크
    if (!trimmed) {
      throw new Error("닉네임은 비어있을 수 없습니다.");
    }

    // 2. 길이 체크
    if (trimmed.length < MIN_LENGTH || trimmed.length > MAX_LENGTH) {
      throw new Error(
        `닉네임은 ${MIN_LENGTH}~${MAX_LENGTH}자 사이여야 합니다.`,
      );
    }

    // 3. 형식 체크 (특수문자 등)
    if (!NICKNAME_REGEX.test(trimmed)) {
      throw new Error("닉네임은 영문, 숫자만 사용할 수 있습니다.");
    }

    return new Nickname(trimmed);
  }

  /**
   * DB에서 복원할 때 사용
   */
  public static restore(value: string): Nickname {
    return new Nickname(value);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Nickname)) return false;
    return this.value === other.value;
  }
}
