import DS from 'ember-data';
import { mapBy } from '@ember/object/computed';

export default DS.Model.extend({
  audioFileName: DS.attr(),
  cdnUrl: DS.attr(),
  soundcloudKey: DS.attr(),
  mixcloudKey: DS.attr(),
  title: DS.attr(),
  podcastPublishedDate: DS.attr(),
  labels: DS.hasMany('label'),
  podcast: DS.belongsTo('podcast'),
  scheduledShow: DS.belongsTo('scheduled-show', { inverse: null }),
  dj: DS.belongsTo('dj'),
  labelNames: mapBy('labels', 'name'),
});
