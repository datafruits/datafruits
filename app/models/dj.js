import DS from 'ember-data';

export default DS.Model.extend({
  username: DS.attr(),
  imageUrl: DS.attr(),
  bio: DS.attr(),
  links: DS.hasMany('link'),
  tracks: DS.hasMany('track'),
  upcomingShows: DS.hasMany('scheduled-show')
});
