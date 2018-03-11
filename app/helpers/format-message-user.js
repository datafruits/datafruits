import Ember from 'ember';
import { htmlSafe } from '@ember/string';
import { helper } from '@ember/component/helper';
import emojione from 'npm:emojione';

export function formatMessageUser(params) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(emojione.shortnameToImage(message));
}

export default helper(formatMessageUser);
