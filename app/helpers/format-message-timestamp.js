import { helper } from '@ember/component/helper';
import moment from 'moment';

export function formatMessageTimestamp(timestamp) {
  return moment(timestamp[0]).format('HH:mm:ss');
}

export default helper(formatMessageTimestamp);
