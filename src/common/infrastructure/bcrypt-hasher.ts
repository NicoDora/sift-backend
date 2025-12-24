import { Injectable } from "@nestjs/common";
import { IPasswordHasher } from "@src/modules/user/domain/interfaces/password-hasher.interface";
import * as bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

@Injectable()
export class BcryptHasher implements IPasswordHasher {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
