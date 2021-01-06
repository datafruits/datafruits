import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);

export function formatTimetableDay(date) {
  const timeZone = dayjs.tz.guess();
  let formattedTime;
  if (new Date().getDate() == new Date(date[0]).getDate()) {
    formattedTime = `Today, ${dayjs(date[0]).tz(timeZone).format('MMMM D')}`;
  } else {
    formattedTime = dayjs(date[0]).tz(timeZone).format('dddd, MMMM D');
  }
  return formattedTime;
}

export default helper(formatTimetableDay);
