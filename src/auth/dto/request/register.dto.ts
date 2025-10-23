import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @Type(() => Date)
  @IsDate()
  hiredAt: Date;
}
