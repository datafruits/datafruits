import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

export function formatDay(date) {
  var formattedTime = dayjs(date[0]).format('YYYY-MM-DD');
  return formattedTime;
}

export default helper(formatDay);
