import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  audioFileName: DS.attr(),
  cdnUrl: DS.attr(),
  title: DS.attr(),
  podcastPublishedDate: DS.attr(),
  labels: DS.hasMany('label'),
  podcast: DS.belongsTo('podcast'),
  dj: DS.belongsTo('dj'),
  labelNames: computed('labels', function(){
    return this.labels.map((label) => {
      return label.get('name');
    });
  })
});
