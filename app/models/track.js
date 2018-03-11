import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  audioFileName: DS.attr(),
  cdnUrl: DS.attr(),
  title: DS.attr(),
  podcastPublishedDate: DS.attr(),
  labels: DS.hasMany('label'),
  podcast: DS.belongsTo('podcast'),
  labelNames: Ember.computed('labels', function(){
    return this.get('labels').map((label) => {
      return label.get('name');
    });
  })
});
