import Model, { attr } from '@ember-data/model';

export default Model.extend({
  username: attr(),
  email: attr(),
  link: attr(),
  interval: attr(),
  desiredTime: attr(),
  otherComment: attr(),
  timeZone: attr()
});
