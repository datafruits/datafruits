import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { mapBy } from '@ember/object/computed';

export default Model.extend({
  audioFileName: attr(),
  cdnUrl: attr(),
  soundcloudKey: attr(),
  mixcloudKey: attr(),
  title: attr(),
  podcastPublishedDate: attr(),
  labels: hasMany('label'),
  podcast: belongsTo('podcast'),
  scheduledShow: belongsTo('scheduled-show', { inverse: null }),
  dj: belongsTo('dj'),
  labelNames: mapBy('labels', 'name'),
});
