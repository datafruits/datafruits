import Ember from 'ember';
import moment from 'moment';

export function formatDate(time) {
  var timeZone = jstz.determine();
  var formattedTime = moment(time[0]).tz(timeZone.name()).format("MM-DD-YYYY dddd HH:mm z");
  return formattedTime;
}

export default Ember.Helper.helper(formatDate);
