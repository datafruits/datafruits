import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export function formatTime(time) {
  const timeZone = dayjs.tz.guess();
  const formattedTime = dayjs(time[0]).tz(timeZone).format('HH:mm');
  return formattedTime;
}

export default helper(formatTime);
