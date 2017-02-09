import TumblrPost from 'ember-tumblr/models/tumblr-post';
import DS from 'ember-data';

export default TumblrPost.extend({
  photos: DS.attr(),
  caption: DS.attr(),
  captionSafe: Ember.computed('caption', function(){
    return Ember.String.htmlSafe(this.get('caption'));
  }),
  body: DS.attr(),
  bodySafe: Ember.computed('body', function(){
    return Ember.String.htmlSafe(this.get('body'));
  }),
});
