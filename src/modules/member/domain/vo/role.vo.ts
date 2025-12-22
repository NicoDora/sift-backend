export const RoleTypes = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type RoleType = (typeof RoleTypes)[keyof typeof RoleTypes];

export class Role {
  private constructor(private readonly value: RoleType) {}

  public static create(value: string): Role {
    const upperValue = value.toUpperCase();
    this.validate(upperValue);

    return new Role(upperValue as RoleType);
  }

  public static User(): Role {
    return new Role(RoleTypes.USER);
  }

  public static Admin(): Role {
    return new Role(RoleTypes.ADMIN);
  }

  public static restore(value: string): Role {
    this.validate(value);
    return new Role(value as RoleType);
  }

  public getValue(): RoleType {
    return this.value;
  }

  public isAdmin(): boolean {
    return this.value === RoleTypes.ADMIN;
  }

  public isUser(): boolean {
    return this.value === RoleTypes.USER;
  }

  public equals(other: unknown): boolean {
    if (!(other instanceof Role)) return false;
    return this.value === other.getValue();
  }

  private static validate(value: string): void {
    const isValid = Object.values(RoleTypes).includes(value as RoleType);

    if (!isValid) {
      throw new Error(`정의되지 않은 권한 타입입니다: ${value}`);
    }
  }
}
