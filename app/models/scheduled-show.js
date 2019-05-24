import DS from 'ember-data';
import { alias } from '@ember/object/computed';

export default DS.Model.extend({
  start: DS.attr(),
  end: DS.attr(),
  title: DS.attr(),
  imageUrl: DS.attr(),
  thumbImageUrl: DS.attr(),
  description: DS.attr(),
  tracks: DS.hasMany('track'),

  htmlDescription: DS.attr(),
  tweetContent: DS.attr(),
  startsAt: alias('start'),
  endsAt: alias('end')
});
