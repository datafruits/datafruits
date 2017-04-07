import Ember from 'ember';
import emojione from 'npm:emojione';

export function formatMessageBody(params/*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return Ember.String.htmlSafe(emojione.shortnameToImage(message).autoLink({ target: "_blank", rel: "noopener noreferrer" }));
}

export default Ember.Helper.helper(formatMessageBody);
