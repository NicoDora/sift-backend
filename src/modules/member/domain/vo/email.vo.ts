const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class Email {
  constructor(private readonly value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    const trimmedEmail = email.trim();

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      throw new Error("Invalid email format");
    }

    return new Email(trimmedEmail);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
