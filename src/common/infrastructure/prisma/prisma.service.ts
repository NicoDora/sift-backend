import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    // 서버 시작 시 DB 연결
    await this.$connect();
  }

  async onModuleDestroy() {
    // 서버 종료 시 연결 해제
    await this.$disconnect();
  }
}
