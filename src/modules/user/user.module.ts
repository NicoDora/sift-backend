import { Module } from "@nestjs/common";
import { UserService } from "@src/modules/user/application/user.service";
import { BcryptHasher } from "@src/modules/user/infrastructure/adapters/bcrypt-hasher";
import { PrismaUserRepository } from "@src/modules/user/infrastructure/persistence/prisma-user.repository";
import { UserMapper } from "@src/modules/user/infrastructure/persistence/user.mapper";
import { UserController } from "@src/modules/user/presentation/user.controller";
import { USER_TOKENS } from "@src/modules/user/user.constant";

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
