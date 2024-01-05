import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';

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
    this.eventBus.publish('trackPlayed', { title: this.args.show.formattedEpisodeTitle, cdnUrl: this.args.track.cdnUrl, id: this.args.show.id });
    //
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
        this.currentUser.user.trackFavorites.pushObject(trackFavorite);
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

  get backgroundStyle() {
    let image;
    const show = this.args.show;
    if (show.thumbImageUrl) {
      image = show.thumbImageUrl;
    // } else if (show.isGuest) {
    //   image = '/assets/images/show_placeholder.jpg';
    // } else if (show.host && show.host.imageUrl) {
    //   image = show.host.imageUrl;
    } else {
      image = '/assets/images/show_placeholder.jpg';
    }
    return htmlSafe(`background-image: url('${image}');`);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PodcastTrack: typeof PodcastTrack;
  }
}

