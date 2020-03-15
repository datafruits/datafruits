import Model, { attr, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Model.extend({
  start: attr(),
  end: attr(),
  title: attr(),
  imageUrl: attr(),
  thumbImageUrl: attr(),
  description: attr(),
  tracks: hasMany('track'),
  djs: hasMany('dj'),
  host: computed('djs', function(){
    return this.djs.get('firstObject');
  }),

  htmlDescription: attr(),
  tweetContent: attr(),
  startsAt: alias('start'),
  endsAt: alias('end')
});
