import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

export function currentTimezone() {
  return dayjs.tz.guess();
}

export default helper(currentTimezone);
