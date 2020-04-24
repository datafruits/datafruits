import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

@classic
export default class PodcastTrack extends Component {
  init() {
    this.eventBus.subscribe("trackPlayed", this, "onTrackPlayed");
    super.init(...arguments);
  }

  @service
  eventBus;

  @action
  play() {
    this.set("playing", true);
    this.set("paused", false);
    this.eventBus.publish("trackPlayed", this);
  }

  @action
  pause() {
    this.set("playing", false);
    this.set("paused", true);
    this.eventBus.publish("trackPaused", this);
  }

  onTrackPlayed(event) {
    if(this !== event){
      if(!(this.isDestroyed || this.isDestroying)) {
        this.set("playing", false);
      }
    }
  }
}
