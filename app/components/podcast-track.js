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
    this.eventBus.subscribe('trackPaused', this, 'onTrackPaused');
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

  _eventPayload() {
    return { title: this.args.show.formattedEpisodeTitle, cdnUrl: this.args.track.cdnUrl, id: this.args.show.id, track_id: this.args.track.id };
  }

  @action
  play() {
    this.playing = true;
    this.paused = false;
    this.eventBus.publish('trackPlayed', this._eventPayload());
    //
  }

  @action
  pause() {
    this.playing = false;
    this.paused = true;
    this.eventBus.publish('trackPaused', this._eventPayload());
  }

  @action
  selectLabel(label) {
    let tags = this.args.selectedLabels;
    tags.push(label);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    debounce(this, this.args.search, 400);
  }

  onTrackPlayed(event) {
    console.log('track played: ', event);
    if (this.args.track.id !== event.track_id) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playing = false;
      }
    }
  }

  onTrackPaused(event) {
    console.log('podcastTrack onTrackPaused: ', event);
    if (this.args.track.id === event.track_id) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playing = false;
        this.paused = true;
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
        this.currentUser.user.trackFavorites.push(trackFavorite);
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
    const id = this.args.show.id;

    return this.currentUser.user.scheduledShowFavorites.map((favorite) => favorite.scheduledShowId).includes(parseInt(id));
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

  get trackOrEpisodeTitle() {
    // use track title if it exists else episode title
    return this.args.track.title || this.args.show.formattedEpisodeTitle;
  }
}
