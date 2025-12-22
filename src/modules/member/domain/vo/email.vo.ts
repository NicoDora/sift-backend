const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  constructor(private readonly value: string) {}

  public static create(email: string): Email {
    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("유효하지 않은 이메일 형식입니다.");
    }

    return new Email(trimmedEmail);
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Email)) return false;
    return this.value === other.value;
  }
}
