import { DomainException } from "@src/common/domain/exception/domain.exception";

export class EmailAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`이미 가입된 이메일입니다: ${email}`);
  }
}

export class InvalidPasswordLengthException extends DomainException {
  constructor(minLength: number) {
    super(`비밀번호는 최소 ${minLength}자 이상이어야 합니다.`);
  }
}

export class InvalidPasswordException extends DomainException {
  constructor() {
    super("비밀번호 형식이 올바르지 않습니다.");
  }
}

export class UserNotFoundException extends DomainException {
  constructor(userId?: string) {
    super(
      userId
        ? `사용자를 찾을 수 없습니다 (ID: ${userId})`
        : "사용자를 찾을 수 없습니다.",
    );
  }
}
