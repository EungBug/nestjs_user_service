import { BadRequestException, Injectable } from '@nestjs/common';
import { AttendanceType, Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { DEFAULT_TZ, now, toLocalDate } from './lib/date.util';
import { DiscordWebhookService } from 'src/notification/discord-webhook.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly discord: DiscordWebhookService,
  ) {}

  // 오늘 근태 조회
  async getToday(userId: number) {
    const date = now(DEFAULT_TZ).toDate();
    const localDate = toLocalDate(date, DEFAULT_TZ);

    const [inRec, outRec] = await Promise.all([
      this.prisma.attendanceHistory.findUnique({
        where: {
          userId_attendanceType_localDate: {
            userId,
            attendanceType: 'CLOCK_IN',
            localDate,
          },
        },
      }),
      this.prisma.attendanceHistory.findUnique({
        where: {
          userId_attendanceType_localDate: {
            userId,
            attendanceType: 'CLOCK_OUT',
            localDate,
          },
        },
      }),
    ]);

    return {
      clockIn: inRec?.occurredAt ?? null,
      clockOut: outRec?.occurredAt ?? null,
    };
  }

  // 오늘 이미 등록된 정보가 있는지
  async already(
    userId: number,
    attendanceType: AttendanceType,
    localDate: string,
  ) {
    return await this.prisma.attendanceHistory.findUnique({
      where: {
        userId_attendanceType_localDate: {
          userId,
          attendanceType: attendanceType,
          localDate,
        },
      },
      select: { id: true, occurredAt: true },
    });
  }

  // 출근 기록
  async clockIn(userId: number) {
    // 실제 발생 시각(서버 기준)
    const occurredAt = now(DEFAULT_TZ).toDate();
    const localDate = toLocalDate(occurredAt, DEFAULT_TZ);

    const already = await this.already(userId, 'CLOCK_IN', localDate);

    // 이미 출근이 찍힌 경우
    if (already) {
      throw new BadRequestException('오늘 출근 기록이 이미 존재합니다.');
    }

    try {
      const created = await this.prisma.attendanceHistory.create({
        data: {
          userId,
          attendanceType: 'CLOCK_IN',
          occurredAt,
          localDate,
        },
      });

      // 디스코드 알림 - 웹훅
      const user = await this.users.findById(userId);
      if (user) {
        this.discord.sendClockIn(user.name, occurredAt);
      }

      return created;
    } catch (e) {
      if (this.isUniqueError(e)) {
        throw new BadRequestException('오늘 출근 기록이 이미 존재합니다.');
      }
      throw e;
    }
  }

  // 퇴근 기록
  async clockOut(userId: number) {
    const occurredAt = now(DEFAULT_TZ).toDate();
    const localDate = toLocalDate(occurredAt, DEFAULT_TZ);

    const todayRecord = await this.getToday(userId);

    if (todayRecord.clockOut) {
      throw new BadRequestException('오늘 퇴근 기록이 이미 존재합니다.');
    }

    // 오늘 출근 기록이 있는 경우 퇴근 가능
    if (!todayRecord.clockIn) {
      throw new BadRequestException('오늘 출근 기록이 존재하지 않습니다.');
    }

    try {
      const created = await this.prisma.attendanceHistory.create({
        data: {
          userId,
          attendanceType: 'CLOCK_OUT',
          occurredAt,
          localDate,
        },
      });

      // 디스코드 알림 - 웹훅
      const user = await this.users.findById(userId);
      if (user) {
        this.discord.sendClockOut(user.name, occurredAt);
      }

      return created;
    } catch (e) {
      if (this.isUniqueError(e)) {
        throw new BadRequestException('오늘 퇴근 기록이 이미 존재합니다.');
      }
      throw e;
    }
  }

  private isUniqueError(e: unknown) {
    return (
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002'
    );
  }
}
