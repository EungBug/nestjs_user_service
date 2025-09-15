import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';

@UseGuards(JwtAuthGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendance: AttendanceService) {}

  @Get('/today')
  todayAttendances(@CurrentUser() userId: number) {
    return this.attendance.getToday(userId);
  }

  @Post('/clock-in')
  clockIn(@CurrentUser() userId: number) {
    return this.attendance.clockIn(userId);
  }

  @Post('/clock-out')
  clockOut(@CurrentUser() userId: number) {
    return this.attendance.clockOut(userId);
  }
}
