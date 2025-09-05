import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';
import { TrackEventPayload, PlayerState } from '../types/player';

interface PodcastTrackArgs {
  show: {
    id: number | string;
    formattedEpisodeTitle: string;
    thumbImageUrl?: string;
    host?: { imageUrl?: string };
    // isGuest?: boolean; // Uncomment if needed
  };
  track: {
    id: number | string;
    cdnUrl?: string;
    title?: string;
    podcastId?: number | string;
    podcast?: any; // Ember Data relationship
    get?: (key: string) => any; // for Ember Data compatibility
  };
  selectedLabels: string[];
  search: () => void;
}

export default class PodcastTrack extends Component<PodcastTrackArgs> {
  constructor(owner: unknown, args: PodcastTrackArgs) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
    this.eventBus.subscribe('trackPaused', this, 'onTrackPaused');
  }

  @service
  declare eventBus: any;

  @service
  declare router: any;

  @service
  declare currentUser: any;

  @service
  declare session: any;

  @service
  declare store: any;

  @tracked
  playerState: PlayerState = PlayerState.Paused;

  get playing(): boolean {
    return this.playerState === PlayerState.Playing;
  }

  _eventPayload(): TrackEventPayload {
    return {
      title: this.args.show.formattedEpisodeTitle,
      cdnUrl: this.args.track.cdnUrl || '',
      id: this.args.show.id,
      track_id: this.args.track.id
    };
  }

  @action
  play(): void {
    this.playerState = PlayerState.Playing;
    this.eventBus.publish('trackPlayed', this._eventPayload());
  }

  @action
  pause(): void {
    this.playerState = PlayerState.Paused;
    this.eventBus.publish('trackPaused', this._eventPayload());
  }

  @action
  selectLabel(label: string): void {
    const tags = this.args.selectedLabels;
    tags.push(label);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    debounce(this, this.args.search, 400);
  }

  onTrackPlayed(event: TrackEventPayload): void {
    console.log('track played: ', event);
    if (this.args.track.id !== event.track_id) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playerState = PlayerState.Paused;
      }
    }
  }

  onTrackPaused(event: TrackEventPayload): void {
    console.log('podcastTrack onTrackPaused: ', event);
    if (this.args.track.id === event.track_id) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playerState = PlayerState.Paused;
      }
    }
  }

  @action
  favoriteTrack(): void {
    const trackFavorite = this.store.createRecord('trackFavorite', {
      track: this.args.track,
    });
    trackFavorite
      .save()
      .then(() => {
        this.currentUser.user.trackFavorites.push(trackFavorite);
        console.log('faved ya ');
      })
      .catch((error: Error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  @action
  unfavoriteTrack(): void {
    const trackFavorite = this.currentUser.user.trackFavorites.find(
      (trackFavorite: { trackId: number }) =>
        trackFavorite.trackId === parseInt(this.args.track.get?.('id'))
    );
    trackFavorite
      .destroyRecord()
      .then(() => {
        console.log('unfaved ya');
      })
      .catch((error: Error) => {
        console.log(`oh no error: ${error}`);
      });
  }

  @action
  favoritePodcast(): void {
    // First get the podcast from the track
    this.args.track.podcast.then((podcast: any) => {
      const podcastFavorite = this.store.createRecord('podcastFavorite', {
        podcast: podcast,
      });
      podcastFavorite
        .save()
        .then(() => {
          this.currentUser.user.podcastFavorites.push(podcastFavorite);
          console.log('faved podcast');
        })
        .catch((error: Error) => {
          console.log(`oh no error: ${error}`);
        });
    });
  }

  @action
  unfavoritePodcast(): void {
    this.args.track.podcast.then((podcast: any) => {
      const podcastFavorite = this.currentUser.user.podcastFavorites.find(
        (podcastFavorite: { podcastId: number }) =>
          podcastFavorite.podcastId === parseInt(podcast.id)
      );
      if (podcastFavorite) {
        podcastFavorite
          .destroyRecord()
          .then(() => {
            console.log('unfaved podcast');
          })
          .catch((error: Error) => {
            console.log(`oh no error: ${error}`);
          });
      }
    });
  }

  get isFavorited(): boolean {
    const id = this.args.show.id;
    return this.currentUser.user.scheduledShowFavorites
      .map((favorite: { scheduledShowId: number }) => favorite.scheduledShowId)
      .includes(parseInt(`${id}`));
  }

  get isPodcastFavorited(): boolean {
    // This is a computed property that needs to handle async podcast relationship
    // For now, we'll check based on podcast ID if available
    if (this.args.track.podcastId) {
      return this.currentUser.user.podcastFavorites
        .map((favorite: { podcastId: number }) => favorite.podcastId)
        .includes(parseInt(this.args.track.podcastId));
    }
    return false;
  }

  get backgroundStyle(): ReturnType<typeof htmlSafe> {
    let image: string;
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

  get trackOrEpisodeTitle(): string {
    // use track title if it exists else episode title
    return this.args.track.title || this.args.show.formattedEpisodeTitle;
  }
}