import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { ModelFrom } from 'datafruits13/lib/type-utils';
import HomeShowsEpisodeRoute from '../../../routes/home/shows/episode';

export default class HomeUserShowsEpisode extends Controller {
  declare model: ModelFrom<HomeShowsEpisodeRoute>;

  @service declare session: any;
  @service declare currentUser: any;

  get canEditShow() {
    return this.session.isAuthenticated && (this.currentUser.user.roles.includes('admin') || this.currentUser.user.username === this.model.hostedBy);
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
// declare module '@ember/controller' {
//   interface Registry {
//     'home/user/shows/episode': HomeUserShowsEpisode;
//   }
// }
