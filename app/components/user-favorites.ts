import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';
import { action } from '@ember/object';

interface UserFavoritesArgs {}

export default class UserFavorites extends Component<UserFavoritesArgs> {
  @service declare currentUser: CurrentUserService;
  @service declare store: any;

  @action
  fetchTracks() {
    let trackIds = this.currentUser.user.trackFavorites.map((trackFavorite: any) => {
      return trackFavorite.trackId;
    });
    return this.store.query('track', { id: trackIds });
  }
}
