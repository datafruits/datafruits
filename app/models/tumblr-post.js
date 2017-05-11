import TumblrPost from 'ember-tumblr/models/tumblr-post';
import Ember from 'ember';
import DS from 'ember-data';

export default TumblrPost.extend({
  photos: DS.attr(),
  caption: DS.attr(),
  player: DS.attr(),
  captionSafe: Ember.computed('caption', function(){
    return Ember.String.htmlSafe(this.get('caption'));
  }),
  playerSafe: Ember.computed('player', function(){
    return Ember.String.htmlSafe(this.get('player')[2].embed_code);
  }),
  body: DS.attr(),
  bodySafe: Ember.computed('body', function(){
    return Ember.String.htmlSafe(this.get('body'));
  }),
});
