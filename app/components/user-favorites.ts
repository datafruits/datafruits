import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import CurrentUserService from 'datafruits13/services/current-user';
import Store from '@ember-data/store';

export default class UserFavorites extends Component {
  @service declare currentUser: CurrentUserService;
  @service declare store: Store;

  get fetchTracks() {
    const scheduledShowIds = this.currentUser.user.scheduledShowFavorites.map((scheduledShowFavorite: any) => {
      return scheduledShowFavorite.scheduledShowId;
    });
    return this.store.query('scheduledShow', { id: scheduledShowIds });
  }
}


declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UserFavorites: typeof UserFavorites;
  }
}

