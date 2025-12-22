export abstract class Url {
  protected constructor(protected readonly value: string) {}

  public getValue(): string {
    return this.value;
  }

  protected static validate(url: string): void {
    try {
      new URL(url);
    } catch (e) {
      throw new Error(`유효하지 않은 URL 형식입니다: ${url}`);
    }
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Url)) return false;
    return this.value === other.getValue();
  }

  public toString(): string {
    return this.value;
  }
}
