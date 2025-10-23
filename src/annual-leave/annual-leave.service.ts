import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import dayjs from 'dayjs';
import { PrismaService } from 'prisma/prisma.service';
import { KST } from 'src/common/utils/time';
import { UsersService } from 'src/users/users.service';
import { DEFAULT_TZ, toLocalDate } from './../attendance/lib/date.util';
import { AnnualLeaveType } from './dto/annual-leave.dto';
import { RegisterLeaveDto } from './dto/request/register-annual-leave.dto';
import { LeaveHistoryItemDto } from './dto/response/annual-leave.response.dto';

@Injectable()
export class AnnualLeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly user: UsersService,
  ) {}

  // 날짜 기준 목록 조회
  async getAllByDate(date: string) {
    const localDate = toLocalDate(dayjs(date).tz(DEFAULT_TZ).toDate());

    const res = await this.prisma.annualLeaveHistory.findMany({
      where: { localDate: localDate },
      orderBy: [{ startDT: 'asc' }],
      select: {
        id: true,
        userId: true,
        startDT: true,
        endDT: true,
        createdAt: true,
        annualLeaveType: true,
        localDate: true,
        user: { select: { name: true } },
      },
    });

    return plainToInstance(LeaveHistoryItemDto, res, {
      excludeExtraneousValues: true,
      enableImplicitConversion: false,
    });
  }

  /** (현재 로그인 사용자) 올해 요약: 총/사용/잔여 */
  async getAnnualLeaveDaysCountByUser(userId: number, year?: number) {
    const y = year ?? new Date().getFullYear();

    const summary = await this.prisma.annualLeaveSummary.findUnique({
      where: { userId_year: { userId: BigInt(userId), year: y } },
      select: {
        entitlementDays: true,
        carriedOverDays: true,
        extraGrantedDays: true,
        usedDays: true,
      },
    });

    if (!summary) {
      return {
        year: y,
        entitlementDays: '0.00',
        carriedOverDays: '0.00',
        extraGrantedDays: '0.00',
        usedDays: '0.00',
        remainingDays: '0.00',
      };
    }

    const { entitlementDays, carriedOverDays, extraGrantedDays, usedDays } =
      summary;

    // 잔여 휴가일
    const remainingDays = new Prisma.Decimal(entitlementDays)
      .plus(carriedOverDays)
      .plus(extraGrantedDays)
      .minus(usedDays);

    return {
      year: y,
      entitlementDays: entitlementDays.toString(),
      carriedOverDays: carriedOverDays.toString(),
      extraGrantedDays: extraGrantedDays.toString(),
      usedDays: usedDays.toString(),
      remainingDays: remainingDays.toFixed(2),
    };
  }

  /** 휴가 사용 등록 (하루 단위) */
  async registerLeave(userId: number, dto: RegisterLeaveDto) {
    const { requestDate, annualLeaveType } = dto;

    // 사용일수 계산
    const usedInc = annualLeaveType === AnnualLeaveType.ALL_DAY ? 1 : 0.5;

    // 해당 날짜의 연도
    const year = Number(requestDate.slice(0, 4));

    return this.prisma.$transaction(async (tx) => {
      const { start, end } = this.buildPeriodKST(requestDate, annualLeaveType);

      // 중복 등록 검사
      await tx.annualLeaveHistory
        .create({
          data: {
            userId: BigInt(userId),
            startDT: start,
            endDT: end,
            annualLeaveType: annualLeaveType,
            localDate: requestDate,
          },
        })
        .catch((_e) => {
          throw new BadRequestException('휴가를 중복 등록할 수 없습니다.');
        });

      // 2) 연도 요약 upsert + usedDays 증가
      const summary = await tx.annualLeaveSummary.upsert({
        where: { userId_year: { userId: BigInt(userId), year } },
        update: { usedDays: { increment: usedInc } },
        create: {
          userId: BigInt(userId),
          year,
          entitlementDays: 0,
          carriedOverDays: 0,
          extraGrantedDays: 0,
          usedDays: usedInc,
          lastAccruedMonth: null,
        },
        select: {
          entitlementDays: true,
          carriedOverDays: true,
          extraGrantedDays: true,
          usedDays: true,
        },
      });

      return true;
    });
  }

  /** 휴가 사용 취소 */
  async cancelLeaveById(userId: number, paramId: number) {
    const id = BigInt(paramId);

    const row = await this.prisma.annualLeaveHistory.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true,
        annualLeaveType: true,
        localDate: true,
        startDT: true,
      },
    });

    if (!row) throw new BadRequestException('존재하지 않는 휴가 입니다.');

    if (row.userId !== BigInt(userId)) {
      throw new ForbiddenException('본인이 등록한 휴가만 삭제할 수 있습니다.');
    }

    const usedDec = row.annualLeaveType === AnnualLeaveType.ALL_DAY ? 1 : 0.5;

    const year = row.localDate?.slice(0, 4)
      ? Number(row.localDate.slice(0, 4))
      : dayjs(row.startDT).tz(KST).year();

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.annualLeaveHistory.delete({ where: { id } });

      const summary = await tx.annualLeaveSummary
        .update({
          where: { userId_year: { userId: BigInt(userId), year } },
          data: { usedDays: { decrement: usedDec } },
          select: {
            entitlementDays: true,
            carriedOverDays: true,
            extraGrantedDays: true,
            usedDays: true,
            year: true,
          },
        })
        .catch((e) => {
          throw e;
        });

      return true;
    });

    return result;
  }

  buildPeriodKST = (
    dateStr: string,
    type: 'ALL_DAY' | 'HALF_AM' | 'HALF_PM',
  ) => {
    switch (type) {
      case 'ALL_DAY':
        return {
          start: new Date(`${dateStr}T09:00:00+09:00`),
          end: new Date(`${dateStr}T18:00:00+09:00`),
        };
      case 'HALF_AM':
        return {
          start: new Date(`${dateStr}T09:00:00+09:00`),
          end: new Date(`${dateStr}T14:00:00+09:00`),
        };
      case 'HALF_PM':
        return {
          start: new Date(`${dateStr}T14:00:00+09:00`),
          end: new Date(`${dateStr}T18:00:00+09:00`),
        };
    }
  };
}
