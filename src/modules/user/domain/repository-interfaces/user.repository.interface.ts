import { User } from "@src/modules/user/domain/entities/user.entity";
import { Email } from "@src/modules/user/domain/value-objects/email.vo";
import { UserId } from "@src/modules/user/domain/value-objects/user-id.vo";

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  existsByEmail(email: Email): Promise<boolean>;
}
