import Ember from 'ember';
import Component from '@ember/component';

export default Component.extend({
  _initialize: Ember.on('init', function(){
    this.get("eventBus").subscribe("trackPlayed", this, "onTrackPlayed");
  }),
  eventBus: Ember.inject.service(),
  actions: {
    play: function(){
      var stream = {
        mp3: this.cdn_url
      };
      if(this.get("paused") !== true){
        Ember.$("#radio-player").jPlayer("setMedia", stream);
      }
      Ember.$("#radio-player").jPlayer("play");
      this.set("playing", true);
      this.set("paused", false);
      this.get('eventBus').publish("trackPlayed", this);
    },
    pause: function(){
      Ember.$("#radio-player").jPlayer("pause");
      this.set("playing", false);
      this.set("paused", true);
    },
    selectLabel(label){
      this.sendAction("selectLabel", label);
    }
  },
  onTrackPlayed: function(event){
    if(this !== event){
      if(!(this.get('isDestroyed') || this.get('isDestroying'))) {
        this.set("playing", false);
      }
    }
  }
});
