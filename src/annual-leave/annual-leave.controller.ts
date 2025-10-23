import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AnnualLeaveService } from './annual-leave.service';
import { RegisterLeaveDto } from './dto/request/register-annual-leave.dto';

@UseGuards(JwtAuthGuard)
@Controller('annual-leave')
export class AnnualLeaveController {
  constructor(private readonly annualLeave: AnnualLeaveService) {}

  @Get('date/:date')
  async getAnnualLeaveDaysByDate(@Param('date') date: string) {
    return this.annualLeave.getAllByDate(date);
  }

  // 사용자 올해 총/사용/잔여
  @Get('count')
  async getAnnualLeaveDaysCount(@CurrentUser() userId: number) {
    return this.annualLeave.getAnnualLeaveDaysCountByUser(userId);
  }

  // 휴가 사용 등록
  @Post()
  async register(@CurrentUser() userId: number, @Body() dto: RegisterLeaveDto) {
    return this.annualLeave.registerLeave(userId, dto);
  }

  // 휴가 사용 취소
  @Delete(':id')
  async cancel(@CurrentUser() userId: number, @Param('id') id: number) {
    return this.annualLeave.cancelLeaveById(userId, id);
  }
}
