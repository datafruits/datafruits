import Ember from 'ember';
import moment from 'moment';

export function formatMessageTimestamp(timestamp) {
  return moment(timestamp[0]).format("HH:mm:ss");
}

export default Ember.Helper.helper(formatMessageTimestamp);
