import { Injectable } from "@nestjs/common";
import { PrismaService } from "@src/common/infrastructure/prisma/prisma.service";
import { User } from "@src/modules/user/domain/entity/user.entity";
import { IUserRepository } from "@src/modules/user/domain/repository/user.repository.interface";
import { Email } from "@src/modules/user/domain/vo/email.vo";
import { UserId } from "@src/modules/user/domain/vo/user-id.vo";
import { UserMapper } from "@src/modules/user/infrastructure/mapper/user.mapper";

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userMapper: UserMapper,
  ) {}

  async save(user: User): Promise<void> {
    const raw = this.userMapper.toPersistence(user);

    await this.prisma.user.upsert({
      where: { id: raw.id },
      update: raw,
      create: raw,
    });
  }

  async findById(id: UserId): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id: id.getValue() },
    });

    return raw ? this.userMapper.toDomain(raw) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    return raw ? this.userMapper.toDomain(raw) : null;
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });
    return count > 0;
  }
}
