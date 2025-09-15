import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import tz from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(tz);

export const DEFAULT_TZ = 'Asia/Seoul';

export const now = (tz = DEFAULT_TZ) => dayjs().tz(tz);
export const toLocalDate = (d: Date, tz = DEFAULT_TZ) =>
  dayjs(d).tz(tz).format('YYYY-MM-DD');
