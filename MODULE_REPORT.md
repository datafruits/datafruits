## Module Report
### Unknown Global

**Global**: `Ember.Handlebars`

**Location**: `app/helpers/format-message-body.js` at line 8

```js

export function formatMessageBody(params/*, hash*/) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(emojione.shortnameToImage(message).autoLink({ target: "_blank", rel: "noopener noreferrer" }));
}
```

### Unknown Global

**Global**: `Ember.Handlebars`

**Location**: `app/helpers/format-message-user.js` at line 7

```js

export function formatMessageUser(params) {
  let message = Ember.Handlebars.Utils.escapeExpression(params[0]);
  return htmlSafe(emojione.shortnameToImage(message));
}
```
