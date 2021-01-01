import { helper } from '@ember/component/helper';
import moment from 'moment';
import jstz from 'jstimezonedetect';

export function formatTimetableDay(date) {
  const timeZone = jstz.determine();
  let formattedTime;
  if (new Date().getDate() == new Date(date[0]).getDate()) {
    formattedTime = `Today, ${moment(date[0]).tz(timeZone.name()).format('MMMM D')}`;
  } else {
    formattedTime = moment(date[0]).tz(timeZone.name()).format('dddd, MMMM D');
  }
  return formattedTime;
}

export default helper(formatTimetableDay);
