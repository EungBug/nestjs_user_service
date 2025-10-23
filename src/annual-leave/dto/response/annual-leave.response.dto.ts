import { AnnualLeaveType } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { toKstDateString, toKstTimeString } from 'src/common/utils/time';

const KST = 'Asia/Seoul';

export class LeaveHistoryItemDto {
  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'bigint') {
      const n = Number(value);
      return n;
    }
    return value;
  })
  id!: number;

  @Expose()
  @Transform(({ value }) => {
    if (typeof value === 'bigint') {
      const n = Number(value);
      return n;
    }
    return value;
  })
  userId!: number;

  @Expose()
  @Transform(({ obj }) => obj.user?.name ?? '')
  userName!: string;

  @Expose()
  @Transform(({ obj }) => obj.localDate || toKstDateString(obj.startDT))
  date!: string;

  @Expose()
  @Transform(({ obj }) => toKstTimeString(obj.startDT))
  startTime!: string;

  @Expose()
  @Transform(({ obj }) => toKstTimeString(obj.endDT))
  endTime!: string;

  @Expose()
  annualLeaveType!: AnnualLeaveType;
}
