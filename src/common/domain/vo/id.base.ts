import { nanoid } from "nanoid";

export abstract class Id {
  constructor(protected readonly value: string) {}

  public getValue(): string {
    return this.value;
  }

  public equals(other: Id): boolean {
    if (!(other instanceof Id)) return false;

    if (this.constructor !== other.constructor) return false;

    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }

  protected static generate(): string {
    return nanoid();
  }
}
