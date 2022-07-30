import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

export default class PodcastTrack extends Component {
  constructor(owner, args) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
  }

  @service
  eventBus;

  @service
  router;

  @service
  currentUser;

  @service
  session;

  @service
  store;

  @tracked
  playing;

  @action
  play() {
    this.playing = true;
    this.paused = false;
    this.eventBus.publish('trackPlayed', { title: this.args.title, cdnUrl: this.args.cdnUrl });
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    this.eventBus.publish('trackPaused', this);
  }

  @action
  selectLabel(label) {
    let tags = this.args.selectedLabels;
    tags.pushObject(label);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    debounce(this, this.args.search, 400);
  }

  onTrackPlayed(event) {
    if (this !== event) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playing = false;
      }
    }
  }

  @action
  favoriteTrack() {
    let trackFavorite = this.store.createRecord('trackFavorite', {
      track: this.args.track,
    });
    trackFavorite
      .save()
      .then(() => {
        console.log('faved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  @action
  unfavoriteTrack() {
    let trackFavorite = this.currentUser.user.trackFavorites.find((trackFavorite) => {
      return trackFavorite.trackId === parseInt(this.args.track.get('id'));
    });
    trackFavorite
      .destroyRecord()
      .then(() => {
        console.log('unfaved ya ');
      })
      .catch((error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  get isFavorited() {
    let id;
    if (typeof this.args.track.get === 'function') {
      id = this.args.track.get('id');
    } else {
      id = this.args.track.id;
    }

    return this.currentUser.user.trackFavorites.map((favorite) => favorite.trackId).includes(parseInt(id));
  }
}
