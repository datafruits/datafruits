import { helper } from '@ember/component/helper';
import moment from 'moment';
import jstz from 'jstimezonedetect';

export function isCurrentShow(show) {
  const now = new Date();
  const [start, end] = [new Date(show[0].start), new Date(show[0].end)];
  if (now >= start && now <= end) {
    return true;
  } else {
    return false;
  }
}

export default helper(isCurrentShow);
