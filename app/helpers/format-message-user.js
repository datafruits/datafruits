import Ember from 'ember';
import emojione from 'npm:emojione';

export function formatMessageUser(params) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return Ember.String.htmlSafe(emojione.shortnameToImage(message));
}

export default Ember.Helper.helper(formatMessageUser);
