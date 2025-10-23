import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

export const KST = 'Asia/Seoul';

// 헬퍼: Date → 'YYYY-MM-DD' (KST)
export function toKstDateString(d?: Date) {
  if (!(d instanceof Date)) return d as any;
  return dayjs(d).tz(KST).format('YYYY-MM-DD');
}

// 헬퍼: Date → 'HH:mm' (KST)
export function toKstTimeString(d?: Date) {
  if (!(d instanceof Date)) return d as any;
  return dayjs(d).tz(KST).format('HH:mm');
}
