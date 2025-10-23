import { IsEnum, IsString, Matches } from 'class-validator';
import { AnnualLeaveType } from '../annual-leave.dto';

export class RegisterLeaveDto {
  @IsString()
  // YYYY-MM-DD
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  requestDate!: string;

  @IsEnum(AnnualLeaveType)
  annualLeaveType!: AnnualLeaveType;
}
