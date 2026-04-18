import Ember from 'ember';
import { htmlSafe } from '@ember/template';
import { helper } from '@ember/component/helper';
import emojione from 'emojione';
import { replaceUserEmojis } from 'datafruits13/utils/user-emoji-registry';

export function formatMessageUser(params) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  message = replaceUserEmojis(message);
  return htmlSafe(emojione.shortnameToImage(message));
}

export default helper(formatMessageUser);
