import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';
import { htmlSafe } from '@ember/template';

// Shared event payload type
export type TrackEventPayload = {
  title: string;
  cdnUrl: string;
  id: number | string;
  track_id: number | string;
};

// Player state enum
export enum PlayerState {
  Playing = 'playing',
  Paused = 'paused',
  Stopped = 'stopped'
}

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
    get?: (key: string) => any; // for Ember Data compatibility
  };
  selectedLabels: string[];
  search: () => void;
}

export default class PodcastTrack extends Component<PodcastTrackArgs> {
  constructor(owner: unknown, args: PodcastTrackArgs) {
    super(owner, args);
    this.eventBus.subscribe('trackPlayed', this, 'onTrackPlayed');
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
  playerState: PlayerState = PlayerState.Stopped;

  get playing(): boolean {
    return this.playerState === PlayerState.Playing;
  }

  @action
  play(): void {
    this.playerState = PlayerState.Playing;
    const payload: TrackEventPayload = {
      title: this.args.show.formattedEpisodeTitle,
      cdnUrl: this.args.track.cdnUrl || '',
      id: this.args.show.id,
      track_id: this.args.track.id
    };
    this.eventBus.publish('trackPlayed', payload);
  }

  @action
  pause(): void {
    this.playerState = PlayerState.Paused;
    this.eventBus.publish('trackPaused', this);
  }

  @action
  selectLabel(label: string): void {
    const tags = this.args.selectedLabels;
    tags.push(label);
    const queryParams = { tags: tags, query: this.router.currentRoute.queryParams.query };
    this.router.transitionTo({ queryParams: queryParams });
    debounce(this, this.args.search, 400);
  }

  onTrackPlayed(event: any): void {
    if (this !== event) {
      if (!(this.isDestroyed || this.isDestroying)) {
        this.playerState = PlayerState.Stopped;
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

  get isFavorited(): boolean {
    const id = this.args.show.id;
    return this.currentUser.user.scheduledShowFavorites
      .map((favorite: { scheduledShowId: number }) => favorite.scheduledShowId)
      .includes(parseInt(`${id}`));
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