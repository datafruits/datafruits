import DS from 'ember-data';

export default DS.Model.extend({
  audioFileName: DS.attr(),
  cdnUrl: DS.attr(),
  title: DS.attr(),
  podcastPublishedDate: DS.attr(),
  labels: DS.hasMany('label'),
  podcast: DS.belongsTo('podcast')
});
