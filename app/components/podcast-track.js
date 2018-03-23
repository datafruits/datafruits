import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Component.extend({
  init(){
    this.get("eventBus").subscribe("trackPlayed", this, "onTrackPlayed");
    this._super(...arguments);
  },
  eventBus: service(),
  actions: {
    play: function(){
      var stream = {
        mp3: this.cdnUrl
      };
      if(this.get("paused") !== true){
        $("#radio-player").jPlayer("setMedia", stream);
      }
      $("#radio-player").jPlayer("play");
      this.set("playing", true);
      this.set("paused", false);
      this.get('eventBus').publish("trackPlayed", this);
    },
    pause: function(){
      $("#radio-player").jPlayer("pause");
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
