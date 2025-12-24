import { Module } from "@nestjs/common";
import { BcryptHasher } from "@src/common/infrastructure/bcrypt-hasher";
import { UserService } from "@src/modules/member/application/user.service";
import { UserMapper } from "@src/modules/member/infrastructure/mapper/user.mapper";
import { PrismaUserRepository } from "@src/modules/member/infrastructure/repositories/prisma-user.repository";
import { USER_TOKENS } from "@src/modules/member/user.constant";

@Module({
  providers: [
    UserService,
    UserMapper,
    {
      provide: USER_TOKENS.IUserRepository,
      useClass: PrismaUserRepository,
    },
    BcryptHasher,
  ],
  exports: [UserService],
})
export class UserModule {}
