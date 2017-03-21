import Ember from 'ember';

export function htmlSafeString(string) {
  return Ember.String.htmlSafe(string);
}

export default Ember.Helper.helper(htmlSafeString);
