import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class PodcastTrack extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
  }

  @service
  eventBus;

  @tracked
  playing;

  @action
  play() {
    this.playing = true;
    this.paused = false;
    this.eventBus.publish('trackPlayed', this);
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    this.eventBus.publish('trackPaused', this);
  }

  onTrackPlayed(event) {
    if (this !== event) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playing = false;
      }
    }
  }
}
