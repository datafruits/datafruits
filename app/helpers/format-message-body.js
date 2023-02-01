import Ember from 'ember';
import emojione from 'emojione';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';
//import 'autolink-js';
import { autoLink } from 'datafruits13/auto-link';

export function formatMessageBody(params /*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(
    autoLink(
      emojione.shortnameToImage(message),
      { target: '_blank', rel: 'noopener noreferrer' }
    ));
}

export default helper(formatMessageBody);
