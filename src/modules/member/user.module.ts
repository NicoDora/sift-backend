import { Module } from "@nestjs/common";
import { BcryptHasher } from "@src/common/infrastructure/bcrypt-hasher";
import { UserService } from "@src/modules/member/application/user.service";
import { UserMapper } from "@src/modules/member/infrastructure/mapper/user.mapper";
import { PrismaUserRepository } from "@src/modules/member/infrastructure/repositories/prisma-user.repository";
import { UserController } from "@src/modules/member/presentation/user.controller";
import { USER_TOKENS } from "@src/modules/member/user.constant";

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserMapper,
    {
      provide: USER_TOKENS.IUserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: USER_TOKENS.IPasswordHasher,
      useClass: BcryptHasher,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
