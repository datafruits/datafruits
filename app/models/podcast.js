import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr(),
  url: DS.attr(),
  meta: DS.attr(),
  tracks: DS.hasMany('track')
});
