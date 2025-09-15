import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceController } from './attendance/attendance.controller';
import { AttendanceService } from './attendance/attendance.service';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // 전역 환경변수 관리 설정
    PrismaModule,
    UsersModule,
    AuthModule,
    AttendanceModule
  ],
  controllers: [AppController, AttendanceController],
  providers: [AppService, AttendanceService],
})

export class AppModule {}
