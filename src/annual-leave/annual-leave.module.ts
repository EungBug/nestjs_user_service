import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AnnualLeaveController } from './annual-leave.controller';
import { AnnualLeaveService } from './annual-leave.service';

@Module({
  controllers: [AnnualLeaveController],
  providers: [AnnualLeaveService, PrismaService, UsersService],
})
export class AnnualLeaveModule {}
