import Ember from 'ember';

export function formatMessageBody(params/*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return Ember.String.htmlSafe(emojione.shortnameToImage(message).autoLink({ target: "_blank", }));
}

export default Ember.Helper.helper(formatMessageBody);
