import TumblrPost from 'ember-tumblr/models/tumblr-post';
import DS from 'ember-data';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default TumblrPost.extend({
  photos: DS.attr(),
  caption: DS.attr(),
  player: DS.attr(),
  captionSafe: computed('caption', function(){
    return htmlSafe(this.get('caption'));
  }),
  playerSafe: computed('player', function(){
    return htmlSafe(this.get('player')[2].embed_code);
  }),
  embedSafe: computed('embed', function(){
    return htmlSafe(this.get('embed'));
  }),
  body: DS.attr(),
  embed: DS.attr(),
  bodySafe: computed('body', function(){
    return htmlSafe(this.get('body'));
  }),
});
