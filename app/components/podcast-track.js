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
      var stream = {
        mp3: this.cdnUrl
      };
      if(this.paused !== true){
        $("#radio-player").jPlayer("setMedia", stream);
      }
      $("#radio-player").jPlayer("play");
      this.set("playing", true);
      this.set("paused", false);
      this.eventBus.publish("trackPlayed", this);
    },
    pause: function(){
      $("#radio-player").jPlayer("pause");
      this.set("playing", false);
      this.set("paused", true);
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
