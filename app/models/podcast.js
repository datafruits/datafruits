import Model, { attr, hasMany } from '@ember-data/model';

export default Model.extend({
  title: attr(),
  url: attr(),
  meta: attr(),
  tracks: hasMany('track')
});
