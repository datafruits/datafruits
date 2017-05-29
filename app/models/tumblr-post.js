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
  embedSafe: Ember.computed('embed', function(){
    return Ember.String.htmlSafe(this.get('embed'));
  }),
  body: DS.attr(),
  embed: DS.attr(),
  bodySafe: Ember.computed('body', function(){
    return Ember.String.htmlSafe(this.get('body'));
  }),
});
