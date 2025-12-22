import { IPasswordHasher } from "@src/modules/member/domain/interfaces/password-hasher.interface";

const MIN_LENGTH = 8;

export class Password {
  private constructor(private readonly value: string) {}

  public static async create(
    plainText: string,
    hasher: IPasswordHasher,
  ): Promise<Password> {
    this.validate(plainText);
    const hashed = await hasher.hash(plainText);
    return new Password(hashed);
  }

  public static restore(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  public async compare(
    plainText: string,
    hasher: IPasswordHasher,
  ): Promise<boolean> {
    return hasher.compare(plainText, this.value);
  }

  private static validate(plainText: string): void {
    if (!plainText || plainText.length < MIN_LENGTH) {
      throw new Error(`비밀번호는 최소 ${MIN_LENGTH}자 이상이어야 합니다.`);
    }
    // 추가적인 정규식 검사(특수문자 포함 등)를 여기에 넣을 수 있습니다.
  }

  public getHashedValue(): string {
    return this.value;
  }
}
