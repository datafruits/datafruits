import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr(),
  email: DS.attr(),
  link: DS.attr(),
  interval: DS.attr(),
  desiredTime: DS.attr(),
  otherComment: DS.attr(),
  timeZone: DS.attr()
});
