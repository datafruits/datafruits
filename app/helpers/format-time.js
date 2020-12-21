import { helper } from '@ember/component/helper';
import moment from 'moment';
import jstz from 'jstimezonedetect';

export function formatTime(time) {
  var timeZone = jstz.determine();
  var formattedTime = moment(time[0]).tz(timeZone.name()).format('HH:mm');
  return formattedTime;
}

export default helper(formatTime);
