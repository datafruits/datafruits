import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';
import { action } from '@ember/object';

export default class UserPodcastFavorites extends Component {
  @service declare currentUser: CurrentUserService;
  @service declare store: any;

  @action
  fetchPodcasts() {
    const podcastIds = this.currentUser.user.podcastFavorites.map((podcastFavorite: any) => {
      return podcastFavorite.podcastId;
    });
    console.log('podcast ids:', podcastIds);
    return this.store.query('podcast', { id: podcastIds });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserPodcastFavorites: typeof UserPodcastFavorites;
  }
}