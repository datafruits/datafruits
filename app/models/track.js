import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

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
  labelNames: computed('labels', function(){
    return this.labels.map((label) => {
      return label.get('name');
    });
  })
});
