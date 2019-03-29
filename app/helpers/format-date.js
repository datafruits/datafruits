import { helper } from '@ember/component/helper';
import moment from 'moment';
import jstz from 'jstimezonedetect';

export function formatDate(time) {
  var timeZone = jstz.determine();
  var formattedTime = moment(time[0]).tz(timeZone.name()).format("MM-DD-YYYY dddd HH:mm z");
  return formattedTime;
}

export default helper(formatDate);
