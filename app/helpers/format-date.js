import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export function formatDate(time) {
  var timeZone = dayjs.tz.guess();
  var formattedTime = dayjs(time[0]).tz(timeZone).format('MM-DD-YYYY dddd HH:mm z');
  return formattedTime;
}

export default helper(formatDate);
