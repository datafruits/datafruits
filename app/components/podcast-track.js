import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  init(){
    this.eventBus.subscribe("trackPlayed", this, "onTrackPlayed");
    this._super(...arguments);
  },
  eventBus: service(),
  actions: {
    play: function(){
      this.set("playing", true);
      this.set("paused", false);
      this.eventBus.publish("trackPlayed", this);
    },
    pause: function(){
      this.set("playing", false);
      this.set("paused", true);
      this.eventBus.publish("trackPaused", this);
    }
  },
  onTrackPlayed: function(event){
    if(this !== event){
      if(!(this.isDestroyed || this.isDestroying)) {
        this.set("playing", false);
      }
    }
  }
});
