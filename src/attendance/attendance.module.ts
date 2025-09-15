import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { PrismaService } from 'prisma/prisma.service';
import { AttendanceController } from './attendance.controller';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
