import { Id } from "@src/common/domain/vo/id.base";

export class UserId extends Id {
  private constructor(value: string) {
    super(value);
  }

  /**
   * 새로운 UserId 생성 (회원가입 등)
   */
  static create(): UserId {
    return new UserId(Id.generate());
  }

  /**
   * DB 등에서 이미 존재하는 값을 복원할 때
   */
  static restore(value: string): UserId {
    return new UserId(value);
  }
}
