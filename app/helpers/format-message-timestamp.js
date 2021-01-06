import { helper } from '@ember/component/helper';
import dayjs from 'dayjs';

export function formatMessageTimestamp(timestamp) {
  return dayjs(timestamp[0]).format('HH:mm:ss');
}

export default helper(formatMessageTimestamp);
