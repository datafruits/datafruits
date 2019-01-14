import Ember from 'ember';
import emojione from 'emojione';
import { helper } from '@ember/component/helper';
import { htmlSafe } from '@ember/string';

export function formatMessageBody(params/*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(emojione.shortnameToImage(message).autoLink({ target: "_blank", rel: "noopener noreferrer" }));
}

export default helper(formatMessageBody);
