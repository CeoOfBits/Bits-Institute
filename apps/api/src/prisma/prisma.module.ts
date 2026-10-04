import { Global, Injectable, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import prismaPkg from '@prisma/client';
import type { PrismaClient as GeneratedClient } from '@prisma/client';

const PrismaClient = prismaPkg.PrismaClient as unknown as typeof GeneratedClient;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
