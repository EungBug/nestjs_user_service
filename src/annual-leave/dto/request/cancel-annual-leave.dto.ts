import { AnnualLeaveType } from '@prisma/client';
import { IsEnum, IsString, Matches } from 'class-validator';

export class CancelLeaveDto {
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  leaveDate!: string;

  @IsEnum(AnnualLeaveType)
  annualLeaveType!: AnnualLeaveType;
}
