import { User } from "@src/modules/member/domain/entity/user.entity";
import { Email } from "@src/modules/member/domain/vo/email.vo";
import { UserId } from "@src/modules/member/domain/vo/user-id.vo";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
