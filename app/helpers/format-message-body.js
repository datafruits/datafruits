import Ember from 'ember';
import emojione from 'emojione';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/template';
import 'autolink-js';
import { replaceUserEmojis } from 'datafruits13/utils/user-emoji-registry';

export function formatMessageBody(params /*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  message = replaceUserEmojis(message);
  return htmlSafe(emojione.shortnameToImage(message).autoLink({ target: '_blank', rel: 'noopener noreferrer' }));
}

export default helper(formatMessageBody);
