import Ember from 'ember';

export default Ember.Component.extend({
  setupTweetButton: function(){
    twttr.widgets.load();
  }.on('didInsertElement')
});
