import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr(),
  imageUrl: DS.attr(),
  bio: DS.attr()
});
