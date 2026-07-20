import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() makes this module available app-wide after being imported once
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
