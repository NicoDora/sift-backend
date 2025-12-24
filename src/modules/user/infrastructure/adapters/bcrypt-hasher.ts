import { Injectable } from "@nestjs/common";
import { AppConfigService } from "@src/core/configs/app-config.service";
import { IPasswordHasher } from "@src/modules/user/domain/service-interfaces/password-hasher.interface";
import * as bcrypt from "bcrypt";

@Injectable()
export class BcryptHasher implements IPasswordHasher {
  constructor(private readonly appConfigService: AppConfigService) {}
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.appConfigService.saltRounds);
  }

  async compare(plainText: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plainText, hashed);
  }
}
