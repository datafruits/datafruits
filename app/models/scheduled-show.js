import DS from 'ember-data';

export default DS.Model.extend({
  start: DS.attr(),
  end: DS.attr(),
  title: DS.attr(),
  imageUrl: DS.attr(),
  thumbImageUrl: DS.attr(),
  description: DS.attr(),

  htmlDescription: DS.attr(),
  tweetContent: DS.attr()
});
