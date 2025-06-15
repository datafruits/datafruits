import Ember from 'ember';
import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';
import emojione from 'emojione';

export function formatMessageUser(params) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(emojione.shortnameToImage(message));
}

export default helper(formatMessageUser);
