import DS from 'ember-data';
import Ember from 'ember';

export default DS.Model.extend({
  start: DS.attr(),
  end: DS.attr(),
  title: DS.attr(),
  image_url: DS.attr(),
  thumb_image_url: DS.attr(),
  description: DS.attr(),
  html_description: DS.attr(),
  tweet_content: DS.attr()
});
